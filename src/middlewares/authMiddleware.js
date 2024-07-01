

//check if a user is verified
const isLoggedIn = async (req, res, next) => {
    if (req.user) {
        return next()
    } else {
        req.flash(
            'error_msg',
            'Bunu yapmak için giriş yapmalısınız'
        )
        res.redirect('/users/login')
    }
}

const notLoggedIn = async (req, res, next) => {
    if (!req.user) {
        return next()
    } else {
        res.redirect('back')
    }
}

//prevents an unverified user from accessing '/dashboard'
const isVerified = async (req, res, next) => {
    if (req.session.verified) {
        return next()
    } else {
        req.flash(
            'error_msg',
            'Bunu yapmak için doğrulanmış olmalısınız'
        )
        res.redirect('/users/login')
    }
}


//prevent verified User from accessing '/verify'
const notVerified = async (req, res, next) => {
    if (!req.session.verified) {
        return next()
    } else {
        res.redirect('back')
    }
}

//!
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
};



const isAdmin = (req, res, next) => {

     // Oturum açan kullanıcının kimliğini alın
     let userId;
     if (req.session.isLoggedIn) {
         // Kullanıcı oturum açmışsa, userId değerini kullanıcı kimliğinden alın
         userId = req.session.userId;
     } else {
         // Kullanıcı oturum açmamışsa, userId değerini undefined olarak ayarlayın
         userId = undefined;
         res.redirect('/users/login')
     }


    if (req.session.isAdmin) {
        // Kullanıcı admin ise bir sonraki middleware veya yönlendirme işlemine devam et
        next();
    } else {
        // Kullanıcı admin değilse giriş yapma sayfasına yönlendir
        res.redirect('/users/login');
    }
};


module.exports = {
    isLoggedIn,
    isVerified,
    notVerified,
    notLoggedIn,
    isAdmin
}