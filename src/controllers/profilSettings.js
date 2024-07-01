const User = require('../models/userModel')
const { sendVerification } = require('../config/twilioLogic')

const Sepet = require('../models/sepetModel')

const getSepetCount = async (userId) => {
    const sepetCount = await Sepet.countDocuments({ userId });
    return sepetCount;
};

const updateUserGet = async (req, res, next) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    const loggedInUserId = req.session.userId;
    const loggedInUser = await User.findOne({ _id: loggedInUserId });

    let sepetCount; // sepetCount değişkenini undefined olarak tanımla
  
      if (req.session.isLoggedIn) {
        sepetCount = await getSepetCount(req.session.userId); // Sepet sayısını al
      }

    res.render('profilSettings', { user ,loggedInUser,sepetCount});

}

const updateUser = async (req, res, next) => {
    try {
        const { name, surname, phonenumber, email, gender, userId } = req.body;

        // Kullanıcıyı veritabanından bul
        const user = await User.findById(userId);

        // Kullanıcının bilgilerini güncelle
        user.name = name;
        user.surname = surname;
        user.phonenumber = phonenumber;
        user.email = email;
        user.gender = gender;

        // Resim güncellemesi
        if (req.file) {
            user.resim = req.file.filename;
        }
        

        // Veritabanında güncelleme işlemini gerçekleştir
        await user.save();

        req.flash('success_profil', 'Kullanıcı bilgileri güncellendi.');
        res.redirect('/users/settings/' + userId);
    } catch (error) {
        // Hata yönetimini burada gerçekleştirin
    }
};


module.exports = {
    updateUser,
    updateUserGet,
    
}