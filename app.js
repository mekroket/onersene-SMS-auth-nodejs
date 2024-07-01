const path = require('path')
const express = require('express');
const passport = require('passport')
const session = require('express-session')

const expressLayouts = require('express-ejs-layouts')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const dotenv = require('dotenv').config();
const flash = require('express-flash');




const app = express();


//db bağlantısı ve sessionları veri tabanına ekleme
require('./src/config/database')

//template engine ayarları
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('views', path.resolve(__dirname, './src/views'));
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




app.use(session({
    secret: "please log me in",
    resave: true,
    saveUninitialized: true
}
));






//express sistemi
app.use(express.json())
app.use(express.urlencoded({ extended: true }))




//flash bağlantısı
app.use(flash());
// tüm proje için hata-başarılı mesajları
app.use(function (req, res, next) {

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.success_update = req.flash('success_update');
    res.locals.success_add = req.flash('success_add');
    res.locals.success_delete = req.flash('success_delete');
    res.locals.success_profil = req.flash('success_profil');
    res.locals.success_hizmet = req.flash('success_hizmet');


    res.locals.user = req.user;
    res.locals.isLoggedIn = req.session.isLoggedIn || false; // isLoggedIn değişkenini res.locals üzerine ekleyin
    res.locals.userName = req.session.name || ''; // Kullanıcının adını res.locals üzerine ekleyin
    res.locals.userId = req.session.userId || undefined; // Oturum kimliğini res.locals üzerine ekleyin
    res.locals.isAdmin = req.session.isAdmin;
    res.locals.kategoriId = req.session.kategoriId;
    res.locals.esnafId = req.session.esnafId;
    res.locals.hizmetId = req.session.hizmetId;
    res.locals.isShop = req.session.isShop;
    res.locals.isSavedToDatabase = false;
    res.locals.sepetCount = req.session.sepetCount
    res.locals.success_msg_flash = req.session.success_msg_flash

    next();
});






//router yolu
const userRouter = require('./src/routers/userRouter')
const midRouter = require('./src/routers/midRouter')
const adminRouter = require('./src/routers/adminRouter')
const esnafRouter = require('./src/routers/esnafRouter')

//routers import
app.use('/users', userRouter);
app.use('/onersene', midRouter);
app.use('/admin', adminRouter);
app.use('/esnaf', esnafRouter)


const Sepet = require('./src/models/sepetModel')
const getSepetCount = async (userId) => {
    const sepetCount = await Sepet.countDocuments({ userId });
    return sepetCount;
};

//routers
app.get('/', async (req, res) => {
    let sepetCount; // sepetCount değişkenini undefined olarak tanımla

    if (req.session.isLoggedIn) {
        sepetCount = await getSepetCount(req.session.userId); // Sepet sayısını al
    }
    res.render('home', { isLoggedIn: req.session.isLoggedIn,sepetCount })
})


//define error handler
app.use(function (err, req, res, next) {
    res.render('error', {
        error: err
    })
})




// jsonwebtoken use
function jsonwebtokenuse() {
    const token = jwt.sign({ _userID: 'newuserid' }, '123456', { expiresIn: '1h' });
    //console.log(token);

    const sonuc = jwt.verify(token, '123456');
    //console.log(sonuc);
}

jsonwebtokenuse();


app.listen(process.env.PORT, () => {
    console.log(`Server ${process.env.PORT} portundan ayaklandı`);
})