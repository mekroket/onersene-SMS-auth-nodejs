const mongoose = require('mongoose')
const User = require('../models/userModel')
const { sendVerification } = require('../config/twilioLogic')
const { verifyStatus } = require('../controllers/verifyControllers');
const passport = require('passport');
const { UserSchema } = require('../models/userModel');
const Kategori = require('../models/kategoriModel')
const Hizmet = require('../models/hizmetModel')
const Esnaf = require('../models/esnafModel')
const Sepet = require('../models/sepetModel')

const getSepetCount = async (userId) => {
    const sepetCount = await Sepet.countDocuments({ userId });
    return sepetCount;
};

//! get istekleri
const adminSayfa = async (req, res, next) => {
    const ITEMS_PER_PAGE = 10;
    const page = +req.query.page || 1;

    try {
        let userId;
        const userCount = await User.countDocuments({ userId });
        req.session.userCount = userCount;

        let kategoriId;
        const kategoriCount = await Kategori.countDocuments({ kategoriId });
        req.session.kategoriCount = kategoriCount;

        let esnafId;
        const esnafCount = await Esnaf.countDocuments({ esnafId });
        req.session.esnafCount = esnafCount;

        let hizmetId;
        const hizmetCount = await Hizmet.countDocuments({ hizmetId });
        req.session.hizmetCount = hizmetCount;

        const loggedInUserId = req.session.userId;
        const loggedInUser = await User.findOne({ _id: loggedInUserId });

        const totalUsers = await User.countDocuments();
        const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

        const users = await User.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);

        const kullaniciSayisi = await User.countDocuments();
        const kategoriSayisi = await Kategori.countDocuments();
        const esnafSayisi = await Esnaf.countDocuments();
        const hizmetSayisi = await Hizmet.countDocuments();
        let sepetCount; // sepetCount değişkenini undefined olarak tanımla
  
        if (req.session.isLoggedIn) {
            sepetCount = await getSepetCount(req.session.userId); // Sepet sayısını al
        }

        const data = {
            labels: ['Kullanıcılar', 'Kategoriler', 'Esnaf', 'Hizmetler'],
            datasets: [{
                data: [kullaniciSayisi, kategoriSayisi, esnafSayisi, hizmetSayisi],
                backgroundColor: ['#008FE0', '#1F9B14', '#ffce56', '#FF0000']
            }]
        };

        const options = {
            responsive: true,
            legend: {
                position: 'bottom',
                labels: {
                    fontSize: 14,
                    padding: 10
                }
            }
        };

        res.render('admin', {
            kategoriCount,
            esnafCount,
            hizmetCount,
            userCount,
            loggedInUser,
            users,
            data,
            options,
            currentPage: page,
            totalPages,
            sepetCount
        });
    } catch (error) {
        // Hata yönetimini burada gerçekleştirin
    }
};


const adminKategori = async (req, res, next) => {
    const kategoriler = await Kategori.find();
    res.render('adminKategori', { kategoriler });

}

const adminUpdate = async (req, res, next) => {
    const kategoriler = await Kategori.find();
    res.render('adminKategoriUpdate', { kategoriler })
}

const adminSil = async (req, res, next) => {
    const kategoriler = await Kategori.find();
    const kategoriId = req.params.id;
    const kategori = await Kategori.findById(kategoriId);
    res.render('adminKategoriSil', { kategoriler, kategori })
}

const adminUserGet = async (req, res, next) => {
    const users = await User.find();
    res.render('adminUserEkle', {
        users,
        userType: 'customer', // Varsayılan olarak userType değerini "customer" olarak ayarlayabilirsiniz
        isShop: false, // Varsayılan olarak isShop değerini false olarak ayarlayabilirsiniz
        isAdmin: false // Varsayılan olarak isAdminUser değerini false olarak ayarlayabilirsiniz
    });
};





//! ekleme işlemleri


const categoryAdd = async (req, res, next) => {
    try {
        const { kategori } = req.body;
        const errors = [];

        const reRenderKategori = () => {
            console.log(errors);
            res.render('adminKategori', {
                errors,
                kategori
            });
        };

        // Resim dosyasını kontrol etmek için gerekli işlemler
        if (!req.file) {
            errors.push({ msg: 'Lütfen bir resim dosyası seçin.' });
            reRenderKategori();
        }

        if (!kategori) {
            errors.push({ msg: 'Lütfen tüm alanları uygun şekilde doldurunuz.' });
            reRenderKategori();
        } else {
            const existingKategori = await Kategori.findOne({ kategori });
            if (existingKategori) {
                errors.push({ msg: 'Kategori zaten mevcut.' });
                reRenderKategori();
            } else {
                const resim = req.file.filename; // Resim dosyasının adını al

                const createdKategori = await Kategori.create({ kategori, resim });
                
                req.flash('success_add', 'Kategori başarıyla eklendi.');
                res.redirect('/admin/kategori');
            }
        }
    } catch (error) {
        next(error);
    }
};


const esnafAdd = async (req, res, next) => {
    try {
        const { esnafAd, esnafUnvan, esnafAdres, esnafKonum, esnafOnay, esnafKomisyon, esnafImage, kategori } = await req.body
        const errors = []

        const reRenderEsnaf = (req, res, next) => {
            console.log(errors)
            res.render('admin', {
                errors,
                esnafAd,
                esnafUnvan,
                esnafAdres,
                esnafKonum,
                esnafOnay,
                esnafKomisyon,
                esnafImage,
                kategori
            })
        }

        if (!kategori || !esnafAd || !esnafUnvan || !esnafAdres || !esnafKonum || !esnafOnay || !esnafKomisyon || !esnafImage) {
            errors.push({ msg: 'lütfen tüm alanları uygun şekilde doldurunuz' })
            reRenderEsnaf(req, res, next)
        } else {
            const existingEsnaf = await Esnaf.findOne().or([{ esnafAd: esnafAd }])
            if (existingEsnaf) {
                errors.push({ msg: 'Esnaf Zaten Mevcut' })
                reRenderEsnaf(req, res, next)
            } else {
                const resim = req.file.filename; // Resim dosyasının adını al
                const esnaf = await Esnaf.create(
                    req.body
                )
                req.flash(
                    'success_msg',
                    'Esnaf Başarıyla Eklendi'
                );
                res.redirect('/admin')
            }

        }
    } catch (error) {
        next(error)
    }
}

const hizmetAdd = async (req, res, next) => {
    try {
        const { esnafId, hizmetAdi, hizmetFiyat, hizmetKdvOran, hizmetImage } = await req.body
        const errors = []

        const reRenderHizmet = (req, res, next) => {
            console.log(errors)
            res.render('admin', {
                errors,
                esnafId,
                hizmetAdi,
                hizmetFiyat,
                hizmetKdvOran,
                hizmetImage
            })
        }

        if (!esnafId || !hizmetAdi || !esnafUnvan || !hizmetFiyat || !hizmetKdvOran || !hizmetImage) {
            errors.push({ msg: 'lütfen tüm alanları uygun şekilde doldurunuz' })
            reRenderHizmet(req, res, next)
        } else {
            const existingHizmet = await Esnaf.findOne()
            if (existingHizmet) {
                errors.push({ msg: 'Hizmet Zaten Mevcut' })
                reRenderHizmet(req, res, next)
            } else {
                const hizmet = await Hizmet.create(
                    req.body
                )
                req.flash(
                    'success_msg',
                    'HizmetBaşarıyla Eklendi'
                );
                res.redirect('/admin')
            }

        }
    } catch (error) {
        next(error)
    }
}

const adminUserAdd = async (req, res, next) => {
    try {
        const { name, surname, phonenumber, email, gender, userType } = req.body;
        const errors = [];

        const reRenderSignup = () => {
            console.log(errors);
            res.render('adminUserEkle', {
                errors,
                name,
                surname,
                phonenumber,
                email,
                gender,
                userType,
                isShop: userType === 'vendor',
                isAdmin: userType === 'admin'
            });
            console.log(name, surname, phonenumber, email, gender, userType);
        };
        if (!name || !surname || !gender || !phonenumber || !email || !userType) {
            errors.push({ msg: 'Lütfen tüm alanları uygun şekilde doldurunuz.' });
            reRenderSignup();
        } else {
            const existingUser = await User.findOne().or([{ email }, { phonenumber }]);
            if (existingUser) {
                errors.push({ msg: 'Kullanıcı zaten var, e-postanızı veya telefon numaranızı değiştirmeyi deneyin.' });
                reRenderSignup();
            } else {
                const resim = req.file.filename; // Resim dosyasının adını al
                const isShop = userType === 'vendor';
                const isAdmin = userType === 'admin';

                const user = await User.create({
                    name,
                    surname,
                    phonenumber,
                    email,
                    gender,
                    isShop,
                    isAdmin,
                    resim
                });
                req.flash('success_msg', 'Artık kayıt oldunuz ve giriş yapabilirsiniz.');
                res.redirect('/admin/user-ekle');
            }
        }
    } catch (error) {
        next(error);
    }
};


//! güncelleme işlemleri
const updateKategori = async (req, res, next) => {
    try {
        const { kategoriId, yeniKategori } = req.body;
        console.log(kategoriId, yeniKategori);

        if (!kategoriId || !yeniKategori) {
            req.flash('error_msg', 'Lütfen tüm alanları doldurunuz');
            return res.redirect('/admin/kategori/update');
        }

        const existingKategori = await Kategori.findById(kategoriId);
        if (!existingKategori) {
            req.flash('error_msg', 'Güncellenecek kategori bulunamadı');
            return res.redirect('/admin/kategori');
        }

        existingKategori.kategori = yeniKategori;

        if (req.file) {
            // Yeni resim dosyası seçildiyse
            existingKategori.resim = req.file.filename;
        }

        req.flash('success_update','Güncelleme İşlemi Başarılı')
        

        await existingKategori.save();

        res.redirect('/admin/kategori/update');
    } catch (error) {
        next(error);
    }
};




//! silme işlemleri
const kategoriSil = async (req, res, next) => {
    try {
        const { kategoriId } = req.body;

        // Kategori silme işlemini gerçekleştir
        await Kategori.findByIdAndDelete(kategoriId);

        req.flash('success_delete', 'Kategori başarıyla silindi');
        res.redirect('/admin/kategori/sil');
    } catch (error) {
        next(error);
    }
};










module.exports = {
    categoryAdd,
    esnafAdd,
    hizmetAdd,
    adminSayfa,
    adminKategori,
    updateKategori,
    adminUpdate,
    kategoriSil,
    adminSil,
    adminUserGet,
    adminUserAdd


}