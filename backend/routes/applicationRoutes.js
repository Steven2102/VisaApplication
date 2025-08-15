const express = require('express');
const { getApplications, getApplication, addapplication, updateapplication, deleteapplication } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getApplications);
router.get('/:id', protect, getApplication); // Fetch a single application
router.post('/', protect, addapplication); // Create new application
router.put('/:id', protect, updateapplication); // Update application
router.delete('/:id', protect, deleteapplication); // Delete application

module.exports = router;