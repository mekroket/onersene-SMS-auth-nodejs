//! imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const { sendVerification } = require('../config/twilioLogic')
const passport = require('passport')


//User Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    phonenumber: {
        type: Number,
        required: true,
        trim: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isShop :{
        type: Boolean,
        default: false 
    },
    resim: {
        type: String,
        default: false
    },
}, { collection: 'user', timestapms: true });

// shema rules
const schema = Joi.object({
    name: Joi.string().min(2).max(50).trim(),
    surname: Joi.string().min(3).max(50).trim(),
    email: Joi.string().trim().email(),
    phonenumber: Joi.string().min(11).max(15).trim(),
    gender: Joi.string().min(5).max(5).trim(),
    resim: Joi.string().trim(),
    
})



// joi use and new user 
UserSchema.methods.joiValidation = function (userObject) {
    schema.required();
    return schema.validate(userObject);
}





// use jsonwebtoken
UserSchema.methods.generateToken = async function () {
    const loginUser = this;
    const token = await jwt.sign({ _id: loginUser._id }, 'secretkey', { expiresIn: '1h' });
    return token;
}




// user info page
UserSchema.methods.tojSON = function () {
    const user = this.toObject();

    delete user._id;
    delete user.__v;

    return user;

};








// UserSchema.statics.login = async (phonenumber) => {
//     const { error, value } = schema.validate({ phonenumber });
//     if (error) {
//         throw createError(400, error);
//     }

//     const user = await User.findOne({ phonenumber });
//     if (!user) {
//         throw createError(400, "Girilen telefon numarası yanlış");
//     }

//     console.log(phonenumber);
    

//     return user;
// }










// user update
UserSchema.statics.joiValidationForUpdate = function (userObject) {
    return schema.validate(userObject);
}





// user out other file
const User = mongoose.model('User', UserSchema);

module.exports = User