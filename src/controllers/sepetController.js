const Sepet = require('../models/sepetModel');
const Hizmet = require('../models/hizmetModel');
const Esnaf = require('../models/esnafModel')

const getSepetCount = async (userId) => {
    const sepetCount = await Sepet.countDocuments({ userId });
    return sepetCount;
};

const getSpet = async (req, res, next) => {
    try {
        const userId = req.session.userId; // Giriş yapan kullanıcının kimliği
        const sepet = await Sepet.find({ userId }).populate('hizmetId', 'hizmetAdi hizmetFiyat hizmetImage hizmetAciklama');

        let sepetCount; // sepetCount değişkenini undefined olarak tanımla

        if (req.session.isLoggedIn) {
            sepetCount = await getSepetCount(req.session.userId); // Sepet sayısını al
        }
        res.render('basket', { sepet, sepetCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




const sepetSistemi = async (req, res, next) => {
    try {
        const hizmetId = req.body.hizmetId;
        const userId = req.session.userId; // Giriş yapan kullanıcının kimliği

        // Hizmeti veritabanından bulun
        const hizmet = await Hizmet.findById(hizmetId);

        if (!hizmet) {
            return res.status(404).json({ message: 'Hizmet bulunamadı' });
        }

        // Sepete ekleme işlemini gerçekleştirin
        const sepetHizmet = {
            hizmetId: hizmet._id,
            miktar: 1,
            tutar: hizmet.hizmetFiyat + (hizmet.hizmetFiyat * hizmet.hizmetKdvOran / 100),
            kdvTutar: hizmet.hizmetFiyat * hizmet.hizmetKdvOran / 100,
            userId: userId // Kullanıcı kimliği sepete eklendi
        };

        const sepet = await Sepet.create(sepetHizmet);

        // Sepet işlemi başarılı olduysa
        const sepetItems = await Sepet.find({ userId });
        let toplamTutar = 0;

        for (let i = 0; i < sepetItems.length; i++) {
            toplamTutar += sepetItems[i].tutar;
        }

        // %4 komisyonu hesaplayın
        const komisyon = toplamTutar * 0.04;
        toplamTutar += komisyon;

        // Toplam tutara %4'lük artışı ekle
        const artis = toplamTutar * 0.04;
        toplamTutar += artis;



        // Sepet öğesini güncelleme işlemini gerçekleştirin
        const updateSepetItem = async (sepetId, action) => {
            // Sepet öğesini bul
            const sepetItem = await Sepet.findById(sepetId);

            if (!sepetItem) {
                throw new Error('Sepet öğesi bulunamadı');
            }

            // Miktarı güncelle
            if (action === 'increase') {
                sepetItem.miktar += 1;
            } else if (action === 'decrease') {
                if (sepetItem.miktar > 1) {
                    sepetItem.miktar -= 1;
                }
            }

            // Fiyatı yeniden hesapla
            const hizmet = await Hizmet.findById(sepetItem.hizmetId);
            sepetItem.tutar = hizmet.hizmetFiyat * sepetItem.miktar;

            // Sepeti güncelle
            await sepetItem.save();
        };

        // Sepet öğelerini artırma/azaltma işlemlerini gerçekleştirin
        const increaseItem = req.body.increaseItem;
        const decreaseItem = req.body.decreaseItem;

        if (increaseItem) {
            await updateSepetItem(increaseItem, 'increase');
        }

        if (decreaseItem) {
            await updateSepetItem(decreaseItem, 'decrease');
        }

        return res.redirect('/onersene/kategori/' + req.params.kategoriId + '/esnaflar/' + req.params.esnafId + '/hizmetler');

    } catch (err) {
        // Hata durumunda
        res.status(500).json({ message: err.message });
    }
};








module.exports = {
    sepetSistemi,
    getSpet
};
