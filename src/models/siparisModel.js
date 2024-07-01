const mongoose = require('mongoose');

const SiparisSchema = new mongoose.Schema({
  siparisNo: {
    type: String,
    required: true
  },
  tarih: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  esnafId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Esnaf',
    required: true
  },
  kupon: {
    type: String
  },
  iskontoTutar: {
    type: Number,
    default: 1
  },
  kdvTutar: {
    type: Number,
    default: 20
  },
  genelToplam: {
    type: Number,
    required: true
  },
  getirmesiTutar: {
    type: Number,
    default:15
  },
  odenecekTutar: {
    type: Number,
    required: true
  },
  komisyonTutar: {
    type: Number,
    default: 4
  },
  siparisDurum: {
    type: String,
    required: true
  },
  odemeTipi: {
    type: String,
    required: true
  }
});

const Siparis = mongoose.model('Siparis', SiparisSchema);

module.exports = Siparis;
