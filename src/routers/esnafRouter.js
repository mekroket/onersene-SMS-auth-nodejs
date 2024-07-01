const express = require('express')
const router = express.Router()

const { esnafController, esnafGet, esnafBilgi } = require('../controllers/esnafController')
const { hizmetController,hizmetEkleget,hizmetEklePost } = require('../controllers/hizmetController')
const { kategoriController } = require('../controllers/kategoriController')
const multer = require('multer');
const path = require('path');

const { isLoggedIn, isVerified, notVerified, notLoggedIn } = require('../middlewares/authMiddleware')


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

router.route('/:userId')

    .get(esnafGet)
    .post(upload.fields([{ name: 'resim' }, { name: 'sliderResim' }]), esnafBilgi)




router.route('/hizmet-ekle/:userId')

    .get(hizmetEkleget)
    .post(upload.single('hizmetImage'), hizmetEklePost)
    


//export router
module.exports = router