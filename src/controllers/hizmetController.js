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
const flash = require('express-flash');


const getSepetCount = async (userId) => {
    const sepetCount = await Sepet.countDocuments({ userId });
    return sepetCount;
};

const { sepetSistemi } = require('./sepetController');

const hizmetController = async (req, res, next) => {
  try {
    const kategori = await Kategori.findById(req.params.kategoriId);
    if (!kategori) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }

    const esnaf = await Esnaf.findById(req.params.esnafId);
    if (!esnaf) {
      return res.status(404).json({ message: 'Esnaf bulunamadı' });
    }

    const hizmetler = await Hizmet.find({ esnafId: esnaf._id });

    // Oturum açan kullanıcının kimliğini alın
    let userId;
    if (req.session.isLoggedIn) {
      // Kullanıcı oturum açmışsa, userId değerini kullanıcı kimliğinden alın
      userId = req.session.userId;
    } else {
      // Kullanıcı oturum açmamışsa, userId değerini undefined olarak ayarlayın
      userId = undefined;
      req.flash('error', 'Oturum açmanız gerekmektedir.');
      return res.redirect('/users/login');
    }

    // Sepete ekleme işlemleri
    if (req.body.hizmetId) {
      await sepetSistemi(req, res, next); // Sepet controller'ını çağırın
    }

    // Sepet ikonunu güncelle
    const sepetCount = await Sepet.countDocuments({ userId });
    req.session.sepetCount = sepetCount;

    res.render('hizmet', { kategori, esnaf, hizmetler, sepetCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const hizmetEkleget = async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const loggedInUserId = req.session.userId;
      const loggedInUser = await User.findOne({ _id: loggedInUserId });
      const esnaf = await Esnaf.findOne({ userId: req.params.userId });
      const esnaflar = await Esnaf.find();
  
      const page = req.query.page || 1; // Varsayılan olarak 1. sayfayı kullanıyoruz
      const ITEMS_PER_PAGE = 5; // Her sayfada 5 hizmet görüntülenecek
  
      const totalHizmetler = await Hizmet.countDocuments({ esnafId: esnaf._id }); // Sadece ilgili esnafa ait hizmetleri say
      const totalPages = Math.ceil(totalHizmetler / ITEMS_PER_PAGE);
    
      let sepetCount; // sepetCount değişkenini undefined olarak tanımla
  
        if (req.session.isLoggedIn) {
            sepetCount = await getSepetCount(req.session.userId); // Sepet sayısını al
        }

  
      const hizmetler = await Hizmet.find({ esnafId: esnaf._id })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
        
  
      res.render('esnafHizmetEkle', { loggedInUser, userId, esnaflar, esnaf, hizmetler, totalPages, currentPage: page , sepetCount });
    } catch (error) {
      next(error);
    }
  };
  

const hizmetEklePost = async (req, res, next) => {
    try {

        const { hizmetAdi, hizmetFiyat, hizmetImage, hizmetAciklama } = req.body;
        const errors = [];
        const userId = req.params.userId;




        const reRenderHizmet = () => {
            console.log(errors);
            res.render('esnafHizmetEkle', {
                errors,
                hizmetAdi,
                hizmetFiyat,
                hizmetImage,
                hizmetAciklama,
            });
        };



        if (!hizmetAdi, !hizmetFiyat, !hizmetImage, !hizmetAciklama) {
            errors.push({ msg: 'Lütfen tüm alanları uygun şekilde doldurunuz.' });
            reRenderHizmet();
        } else {
            const existingHizmet = await Hizmet.findOne({ hizmetAdi });
            if (existingHizmet) {
                errors.push({ msg: 'Hizmet zaten mevcut.' });
                reRenderHizmet();
            } else {
                const esnaflar = await Esnaf.find();
                const hizmetImage = req.file.filename;
                const esnafId = req.body.esnafId; // Formdan gönderilen esnafId değerini alın
                const createdHizmet = await Hizmet.create({ hizmetAdi, hizmetFiyat, hizmetImage, hizmetAciklama, esnafId,userId });



                req.flash('success_hizmet', 'Hizmet başarıyla eklendi.');
                res.redirect('/esnaf/hizmet-ekle/' + userId);
            }
        }
    } catch (error) {
        next(error);
    }
};

// hizmet ekleme sayfasında listelenen hizmetlerden sadece o hizmetleri ekleyen kişinin id si ise hizmetleri gösterecek
// yani sadece o hizmeti ekleyen kişi o hizmeti görebilecek




















module.exports = {
    hizmetController,
    hizmetEkleget,
    hizmetEklePost


}