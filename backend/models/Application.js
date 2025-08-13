
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    cost: { type: String},
    firstname: { type: String },
    lastname: { type: String },
    countryofresidence: { type: String },
    email: { type: String },
    city: { type: String },
    dateofarrival: { type: Date },
    dateofdeparture: { type: Date },
    //completed: { type: Boolean, default: false },
});

module.exports = mongoose.model('application', applicationSchema);