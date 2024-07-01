const mongoose = require('mongoose')
const passport = require('passport')
const User = require('../models/userModel')
const { sendVerification, checkVerification } = require('../config/twilioLogic')
const Sepet = require('../models/sepetModel')

const getSepetCount = async (userId) => {
    const sepetCount = await Sepet.countDocuments({ userId });
    return sepetCount;
};


const loadVerify = async (req, res) => {
    let sepetCount; // sepetCount değişkenini undefined olarak tanımla
  
    if (req.session.isLoggedIn) {
      sepetCount = await getSepetCount(req.session.userId); // Sepet sayısını al
    }
    res.render('verify',{sepetCount})
}



const resendCode = async (req, res) => {
    sendVerification(req, res, req.body.phonenumber)
    res.redirect('/users/verify')

}


const verifyUser = async(req, res) => {
    //check verification code from user input
    console.log(req.session.phonenumber);
    console.log(req.body.verifyCode);
    
    const verifyStatus = await checkVerification(req, res, req.session.phonenumber, req.body.verifyCode)
    
    if(verifyStatus === 'approved') {
        req.session.verified = true
        res.redirect('/onersene/kategori')
    } else {
        req.session.verified = false
        req.flash(
            'error_msg',
            'wrong verification code'
        )
        res.redirect('/users/verify')
    }
}











module.exports = {
    loadVerify,
    verifyUser,
    resendCode
}