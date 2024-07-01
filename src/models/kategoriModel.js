//! imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const passport = require('passport')


//User Schema
const KategoriSchema = new Schema({
    kategori: {
        type: String,
        required: true
    },
    resim: {
        type: String,
        required: true
    }
    
}, { collection: 'kategori', timestapms: true });

const Kategori = mongoose.model('Kategori', KategoriSchema);


module.exports = Kategori