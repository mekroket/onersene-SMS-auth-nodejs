//! imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const passport = require('passport')


//User Schema
const SepetSchema = new Schema({
    hizmetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hizmet'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
    miktar: {
      type: Number
    },
    tutar: {
      type: Number
    },
    kdvTutar: {
      type: Number
    }
  }, { collection: 'sepetler', timestamps: true });





const Sepet = mongoose.model('Sepet', SepetSchema);


module.exports = Sepet