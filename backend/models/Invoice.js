const mongoose = require('mongoose');

//Invoice Schema MongoDB
const invoiceSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  cost: { type: String, required: true },
  method: { type: String, required: true },
  details: { type: Object },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('invoice', invoiceSchema);