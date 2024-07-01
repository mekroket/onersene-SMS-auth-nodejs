const express = require('express')
const router = express.Router()
const { login, getLogin, createUser, getSignup, logout,esnafOl,esnafOlGet } = require('../controllers/userControllers')
const { loadVerify, verifyUser, resendCode } = require('../controllers/verifyControllers')
const { isLoggedIn, isVerified, notVerified, notLoggedIn } = require('../middlewares/authMiddleware')
const multer = require('multer');
const path = require('path');

const { esnafController } = require('../controllers/esnafController')
const { hizmetController } = require('../controllers/hizmetController')
const { kategoriController } = require('../controllers/kategoriController')
const { updateUser, updateUserGet } = require('../controllers/profilSettings')

//login route
router.route('/login')
    .all(notLoggedIn)
    .get(getLogin)
    .post(login)

//signup route
router.route('/signup')
    .all(notLoggedIn)
    .get(getSignup)
    .post(createUser)


//signup route
router.route('/esnaf-ol')
    // .all(notLoggedIn)
    .get(esnafOlGet)
    .post(esnafOl)    


//signup route
router.route('/logout')
    .get(logout)



router.route('/resend')
    .all(isLoggedIn, notVerified)
    .get(resendCode)

//verify route
router.route('/verify')
    .all(notVerified)
    .get(loadVerify)
    .post(verifyUser)

//dashboard
router.route('/succes')
    .all(isLoggedIn, isVerified)
    .get(async (req, res) => {
        res.render('succes')
    })


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); // Resimlerin kaydedileceği klasörü belirtin
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Resim dosyasının adını belirleyin
    }
});

const upload = multer({ storage: storage });

router.route('/settings/:userId')
    .get(updateUserGet)
    .post(upload.single('resim'),updateUser)



module.exports = router


//export router
module.exports = router