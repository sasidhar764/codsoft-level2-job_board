const express = require('express');
const { getDashboard } = require('../controllers/userController');
const auth = require('../middleware/Auth');
const router = express.Router();

// Dashboard route: GET /api/user/dashboard
router.get('/dashboard', auth, getDashboard);

module.exports = router;
