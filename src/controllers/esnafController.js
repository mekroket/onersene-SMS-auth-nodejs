const mongoose = require('mongoose')
const User = require('../models/userModel')
const { sendVerification } = require('../config/twilioLogic')
const { verifyStatus } = require('../controllers/verifyControllers');
const passport = require('passport');
const { UserSchema } = require('../models/userModel');
const Kategori = require('../models/kategoriModel')
const Esnaf = require('../models/esnafModel')
const Sepet = require('../models/sepetModel')

const getSepetCount = async (userId) => {
    const sepetCount = await Sepet.countDocuments({ userId });
    return sepetCount;
};

//sign up Logic
const esnafController = async (req, res, next) => {
    try {
        const kategori = await Kategori.findById(req.params.id);
        if (!kategori) {
            return res.status(404).json({ message: 'Kategori bulunamadı' });
        }
        const esnaflar = await Esnaf.find({ kategori: kategori._id });
        let sepetCount; // sepetCount değişkenini undefined olarak tanımla
  
        if (req.session.isLoggedIn) {
            sepetCount = await getSepetCount(req.session.userId); // Sepet sayısını al
        }


        console.log(esnaflar);
        res.render('esnaf', { kategori, esnaflar ,sepetCount});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


const esnafGet = async (req, res, next) => {
    try {
        const kategoriler = await Kategori.find();
        const esnaf = await Esnaf.findOne({ userId: req.params.userId });
        let sepetCount; // sepetCount değişkenini undefined olarak tanımla
  
        if (req.session.isLoggedIn) {
            sepetCount = await getSepetCount(req.session.userId); // Sepet sayısını al
        }


        res.render('esnafBilgi', {
            kategoriler,
            esnafAd: esnaf?.esnafAd || '',
            il: esnaf?.il || '',
            ilce: esnaf?.ilce || '',
            mahalle: esnaf?.mahalle || '',
            sokak: esnaf?.sokak || '',
            no: esnaf?.no || '',
            vergiNo: esnaf?.vergiNo || '',
            kategori: esnaf?.kategori || '',
            resim: esnaf?.resim || '',
            sliderResim: esnaf?.sliderResim || '',
            sepetCount
        });
    } catch (error) {
        next(error);
    }
};



const esnafBilgi = async (req, res, next) => {
    try {
        const {
            esnafAd,
            il,
            ilce,
            mahalle,
            sokak,
            no,
            esnafOnay,
            esnafKomisyon,
            sozlesme,
            kategori,
            vergiNo
        } = req.body;

        const userId = req.params.userId;


        const errors = [];

        const reRenderSignup = () => {
            console.log(errors);
            res.render('esnafBilgi', {
                errors,
                esnafAd,
                il,
                ilce,
                mahalle,
                sokak,
                no,
                sozlesme,
                kategori,
                vergiNo,
                kategoriler: [],
                isSavedToDatabase: false
            });
        };

        if (
            !esnafAd ||
            !il ||
            !ilce ||
            !mahalle ||
            !sokak ||
            !no ||
            !sozlesme ||
            !kategori ||
            !vergiNo
        ) {
            errors.push({ msg: 'Lütfen tüm alanları uygun şekilde doldurunuz' });
            console.log({
                esnafAd,
                il,
                ilce,
                mahalle,
                sokak,
                no,
                sozlesme,
                kategori,
                vergiNo,
                kategoriler: [],
                isSavedToDatabase: false
            });
            reRenderSignup();
        } else {
            const existingEsnaf = await Esnaf.findOne().or([{ vergiNo }]);
            if (existingEsnaf) {
                errors.push({ msg: 'Bu vergi no zaten kayıtlı' });
                reRenderSignup();
            } else {
                const resim = req.files['resim'][0].filename;
                const sliderResim = req.files['sliderResim'][0].filename;

                const kategoriler = await Kategori.find();

                const esnaf = await Esnaf.create({
                    esnafAd,
                    il,
                    ilce,
                    mahalle,
                    sokak,
                    no,
                    esnafOnay,
                    esnafKomisyon,
                    resim,
                    sliderResim,
                    sozlesme,
                    kategori,
                    vergiNo,
                    userId,
                    isSavedToDatabase: true

                });

                req.flash('success_msg', 'Artık kayıt oldunuz ve giriş yapabilirsiniz');
                res.redirect('/esnaf/' + userId);

                

            }
        }
    } catch (error) {
        next(error);
    }
};








module.exports = {
    esnafController,
    esnafGet,
    esnafBilgi
}