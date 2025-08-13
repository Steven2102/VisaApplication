const express = require('express');
const { getApplication, addapplication, updateapplication, deleteapplication } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:id', protect, getApplication);

module.exports = router;