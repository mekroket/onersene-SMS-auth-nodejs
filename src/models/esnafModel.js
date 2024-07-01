//! imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const passport = require('passport')


//User Schema
const EsnafSchema = new Schema({
    esnafAd: {
        type: String,
        required: true
    },
    il: {
        type: String,
        required: true
    },
    ilce: {
        type: String,
        required: true
    },
    mahalle: {
        type: String,
        required: true
    },
    sokak: {
        type: String,
        required: true
    },
    no: {
        type: String,
        required: true
    },
    esnafOnay: {
        type: Boolean,
        default:true
    },
    esnafKomisyon: {
        type: Number,
        default:4
    },
    resim: {
        type: String,
        required: true
    },
    sliderResim: {
        type: String,
        required: true
    },
    sozlesme: {
        type: Boolean,
        required: true
    },
    vergiNo: {
        type: Number,
        required: true
    },
    kategori: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kategori'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { collection: 'esnaf', timestamps: true });





const Esnaf = mongoose.model('Esnaf', EsnafSchema);


module.exports = Esnaf