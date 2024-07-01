const mongoose = require('mongoose')
const User = require('../models/userModel')
const { sendVerification } = require('../config/twilioLogic')
const { verifyStatus } = require('../controllers/verifyControllers');
const passport = require('passport');
const { UserSchema } = require('../models/userModel');
const Kategori = require('../models/kategoriModel')
const Sepet = require('../models/sepetModel')


const getSepetCount = async (userId) => {
    const sepetCount = await Sepet.countDocuments({ userId });
    return sepetCount;
};

const kategoriController = async (req, res, next) => {
    try {
      const kategoriler = await Kategori.find();
      let sepetCount; // sepetCount değişkenini undefined olarak tanımla
  
      if (req.session.isLoggedIn) {
        sepetCount = await getSepetCount(req.session.userId); // Sepet sayısını al
      }
  
      res.render('kategori', { kategoriler, sepetCount });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  

module.exports = {
    kategoriController
}

