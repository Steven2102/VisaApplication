const express = require('express');
const { getinvoices, addinvoice, updateinvoice, deleteinvoice } = require('../controllers/invoiceController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getinvoices)
  .post(protect, addinvoice);

router.route('/:id')
  .put(protect, updateinvoice)
  .delete(protect, deleteinvoice);

module.exports = router;