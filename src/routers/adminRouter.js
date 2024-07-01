const express = require('express')
const router = express.Router()

const { esnafController } = require('../controllers/esnafController')
const { hizmetController } = require('../controllers/hizmetController')
const { kategoriController } = require('../controllers/kategoriController')
const { isAdmin } = require('../middlewares/authMiddleware')
const multer = require('multer');
const path = require('path');



const { adminSayfa, categoryAdd, esnafAdd, hizmetAdd, adminKategori, updateKategori, adminUpdate, adminSil, kategoriSil, adminUserGet, adminUserAdd } = require('../controllers/adminController')


// isadmin eklenecek , her ekleme sayfası ayrı olacak , yeni sayfalara yazılacak , / olan sayfa ana admin sayfası olacak


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



router.route('/')
    .all(isAdmin)
    .get(adminSayfa)




router.route('/kategori')
    .get(adminKategori)
    .post(upload.single('resim'), categoryAdd);





router.route('/kategori/update')

    .get(adminUpdate)
    .post(upload.single('resim'),updateKategori)



router.route('/kategori/sil')

    .get(adminSil)
    .post(kategoriSil)





router.route('/user-ekle')

    .get(adminUserGet)
    .post(upload.single('resim'),adminUserAdd)




router.route('/esnaf')

    .get(adminSayfa)
    .post(esnafAdd)




router.route('/hizmet')

    .get(adminSayfa)
    .post(hizmetAdd)
//export router
module.exports = router