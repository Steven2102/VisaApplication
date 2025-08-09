
const express = require('express');
const { getapplications, addapplication, updateapplication, deleteapplication } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getapplications).post(protect, addapplication);
router.route('/:id').put(protect, updateapplication).delete(protect, deleteapplication);

module.exports = router;