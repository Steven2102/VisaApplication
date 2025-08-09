const Application = require('../models/Application');
const getapplications = async (
req,
res) => {
try {
const applications = await Application.find({ userId: req.user.id });
res.json(applications);
} catch (error) {
res.status(500).json({ message: error.message });
}
};

const addapplication = async (
req,
res) => {
const { title, firstname, lastname, countryofresidence, email, city, dateofarrival, dateofdeparture } = req.body;
try {
const application = await Application.create({ userId: req.user.id, title, firstname, lastname, countryofresidence, email, city, dateofarrival, dateofdeparture});
res.status(201).json(application);
} catch (error) {
res.status(500).json({ message: error.message });
}
};

const updateapplication = async (
req,
res) => {
const { title, firstname, lastname, countryofresidence, email, city, dateofarrival, dateofdeparture} = req.body;
try {
const application = await Application.findById(req.params.id);
if (!application) return res.status(404).json({ message: 'application not found' });
application.title = title || application.title;
application.firstname = firstname || application.firstname;
application.lastname = lastname || application.lastname;
application.countryofresidence = countryofresidence || application.countryofresidence;
application.email = email || application.email;
application.city = city || application.city;
application.dateofarrival = dateofarrival || application.dateofarrival;
application.dateofdeparture = dateofdeparture || application.dateofdeparture;
const updatedapplication = await application.save();
res.json(updatedapplication);
} catch (error) {
res.status(500).json({ message: error.message });
}
};

const deleteapplication = async (
req,
res) => {
try {
const application = await Application.findById(req.params.id);
if (!application) return res.status(404).json({ message: 'application not found' });
await application.remove();
res.json({ message: 'application deleted' });
} catch (error) {
res.status(500).json({ message: error.message });
}
};
module.exports = { getapplications, addapplication, updateapplication, deleteapplication };