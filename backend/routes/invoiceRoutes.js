const express = require('express');
const { getinvoices, getInvoiceByApplication, addinvoice, updateinvoice, deleteinvoice } = require('../controllers/invoiceController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getinvoices)
  .post(protect, addinvoice);

// Get invoice for a specific application
router.get('/application/:applicationId', protect, getInvoiceByApplication);

router.route('/:id')
  .put(protect, updateinvoice)
  .delete(protect, deleteinvoice);

module.exports = router;