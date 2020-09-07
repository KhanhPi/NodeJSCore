const express = require('express');
const {
    register,
    login,
    getAll,
    getById,
    updateUser,
    addUser,
    getCurrentUser,
    forgotPassword
} = require('../controllers/users');
// var auth = require('../middleware/auth');
// xác thực token
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// Đăng ký
router.route('/login').post(login);

router.route('/register').post(register);
router.route('/:id').get(protect, getById);
router.route('/:id').put(protect, updateUser);
router.route('/').post(addUser);
router.route('/').get(protect, getAll);
router.route('/me').get(protect, getCurrentUser);
router.route('/forgotPassword').post(forgotPassword);

module.exports = router  