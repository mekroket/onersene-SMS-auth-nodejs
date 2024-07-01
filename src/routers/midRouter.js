const express = require('express')
const router = express.Router()

const { esnafController } = require('../controllers/esnafController')
const { hizmetController } = require('../controllers/hizmetController')
const { kategoriController } = require('../controllers/kategoriController')
const {getSpet,sepetSistemi } = require('../controllers/sepetController')


const { isLoggedIn, isVerified, notVerified, notLoggedIn } = require('../middlewares/authMiddleware')




router.route('/kategori')

    .get(kategoriController)



router.route('/kategori/:id/esnaflar')

    .get(esnafController)


router.route('/kategori/:kategoriId/esnaflar/:esnafId/hizmetler')

    .all(hizmetController)


router.route('/sepet')

    .get(getSpet)
    





//export router
module.exports = router