
const User = require('../models/userModel')
const { sendVerification } = require('../config/twilioLogic')



//sign up Logic
const getSignup = async (req, res, next) => {
    let sepetCount; // sepetCount değişkenini undefined olarak tanımla
  
    if (req.session.isLoggedIn) {
      sepetCount = await getSepetCount(req.session.userId); // Sepet sayısını al
    }
    res.render('signup',{sepetCount})
}

const createUser = async (req, res, next) => {
    try {
        const { name, surname, phonenumber, email, gender , isShop} = await req.body
        const errors = []

        const reRenderSignup = (req, res, next) => {
            console.log(errors)
            res.render('signup', {
                errors,
                name,
                surname,
                phonenumber,
                email,
                gender,
                isShop
            })
        }

        if (!name || !surname || !gender || !phonenumber || !email || !isShop) {
            errors.push({ msg: 'lütfen tüm alanları uygun şekilde doldurunuz' })
            reRenderSignup(req, res, next)
        } else {
            const existingUser = await User.findOne().or([{ email: email }, { phonenumber: phonenumber }])
            if (existingUser) {
                errors.push({ msg: 'Kullanıcı zaten var, e-postanızı veya telefon numaranızı değiştirmeyi deneyin' })
                reRenderSignup(req, res, next)
            } else {
                const user = await User.create(
                    req.body
                )
                req.flash(
                    'success_msg',
                    'Artık kayıt oldunuz ve giriş yapabilirsiniz'
                );
                res.redirect('/users/login')
            }

        }
    } catch (error) {
        next(error)
    }
}

const getSepetCount = async (userId) => {
    const sepetCount = await Sepet.countDocuments({ userId });
    return sepetCount;
};


const getLogin = async (req, res) => {
    let sepetCount; // sepetCount değişkenini undefined olarak tanımla
  
    if (req.session.isLoggedIn) {
      sepetCount = await getSepetCount(req.session.userId); // Sepet sayısını al
    }
    res.render('login',{sepetCount})
}




const login = async (req, res, next) => {
    const userLogin = async (phonenumber) => {
        const user = await User.findOne({ phonenumber });

        // Kullanıcı bulunamadığında flash mesajını ayarla
        if (!user) {
            req.flash('error', 'Kullanıcı bulunamadı.');
            return null; // Kullanıcı bulunmadığı için null döndür
        }

        sendVerification(req, res, phonenumber);
        console.log(phonenumber);

        return user;
    };

    const user = await userLogin(req.body.phonenumber);

    // Kullanıcı varsa token oluştur ve verify sayfasına yönlendir
    if (user) {
        const token = await user.generateToken();

        req.session.phonenumber = req.body.phonenumber;
        req.session.userId = user._id; // req.session.userId olarak düzeltildi

        req.session.isLoggedIn = true; // Giriş yapıldığını belirtmek için isLoggedIn değişkenini true olarak ayarla
        req.session.name = user.name;
        req.session.isAdmin = user.isAdmin; // isAdmin bilgisini session'a ekle
        req.session.isShop = user.isShop; // isAdmin bilgisini session'a ekle

        if (user.isAdmin) {
            // Admin kullanıcı
            // Yapılacak işlemleri burada tanımlayın
            console.log('Admin kullanıcı giriş yaptı');
        } else if (user.isShop) {
            // Mağaza kullanıcısı
            // Yapılacak işlemleri burada tanımlayın
            console.log('Mağaza kullanıcısı giriş yaptı');
        } else {
            // Normal kullanıcı
            // Yapılacak işlemleri burada tanımlayın
            console.log('Normal kullanıcı giriş yaptı');
        }
        
        return res.redirect('/users/verify');
    }

    // Kullanıcı yoksa login sayfasına yönlendir
    return res.redirect('/users/login');
};


const logout = (req, res, next) => {
    req.session.isLoggedIn = false; // Giriş yapılmadığını belirtmek için isLoggedIn değişkenini false olarak ayarla
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
};




const loadVerify = async (req, res) => {
    res.render('verify')
}



const resendCode = async (req, res) => {
    sendVerification(req, res, req.body.phonenumber)
    res.redirect('/users/verify')
}

const esnafOl = async (req,res,next) =>{
    try {
        const { name, surname, phonenumber, email, gender , isShop} = await req.body
        const errors = []

        const reRenderSignup = (req, res, next) => {
            console.log(errors)
            res.render('signup', {
                errors,
                name,
                surname,
                phonenumber,
                email,
                gender,
                isShop
            })
        }

        if (!name || !surname || !gender || !phonenumber || !email || !isShop) {
            errors.push({ msg: 'lütfen tüm alanları uygun şekilde doldurunuz' })
            reRenderSignup(req, res, next)
        } else {
            const existingUser = await User.findOne().or([{ email: email }, { phonenumber: phonenumber }])
            if (existingUser) {
                errors.push({ msg: 'Kullanıcı zaten var, e-postanızı veya telefon numaranızı değiştirmeyi deneyin' })
                reRenderSignup(req, res, next)
            } else {
                const user = await User.create(
                    req.body
                )
                req.flash(
                    'success_msg',
                    'Artık kayıt oldunuz ve giriş yapabilirsiniz'
                );
                res.redirect('/users/login')
            }

        }
    } catch (error) {
        next(error)
    }
}

const esnafOlGet = async (req,res,next) =>{
    let sepetCount; // sepetCount değişkenini undefined olarak tanımla
  
    if (req.session.isLoggedIn) {
      sepetCount = await getSepetCount(req.session.userId); // Sepet sayısını al
    }
    res.render('esnafOl',{sepetCount})
}





module.exports = {
    createUser,
    getSignup,
    login,
    getLogin,
    loadVerify,
    resendCode,
    logout,
    esnafOl,
    esnafOlGet



}