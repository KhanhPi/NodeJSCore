const express = require('express');
const {
    register,
    login,
    getCurrentUser,
    forgotPassword
} = require('../controllers/users');

// xác thực token
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Đăng ký
router.route('/register')
    .post(register)
router.route('/login')
    .post(login)
router.route('/me')
    .get(protect, getCurrentUser)
router.route('/forgotPassword')
    .post(forgotPassword)

module.exports = router