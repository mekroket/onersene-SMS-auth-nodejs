//! imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const passport = require('passport')


//User Schema
const HizmetSchema = new Schema({
    esnafId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Esnaf'
    },
    hizmetAdi: {
        type: String,
        required: true
    },
    hizmetFiyat: {
        type: Number,
        required: true
    },
    hizmetKdvOran: {
        type: Number,
        required: true,
        default:4
    },
    hizmetImage: {
        type: String,
        required:true
    },
    hizmetAciklama: {
        type: String,
        required:true
    }
}, { collection: 'hizmetler', timestamps: true });





const Hizmet = mongoose.model('Hizmet', HizmetSchema);


module.exports = Hizmet