const express = require('express');

// xác thực token
const { protect } = require('../middleware/auth');

// mergeParams: để hợp nhất các tham số
const router = express.Router({ mergeParams: true });
const r = require('express').Router();

// import các phương thức
const {
    createRole,
    getById,
    getAll,
    updateRole,
    deleteRole,
} = require('../controllers/roles');

// Cấu hình router cho các phương thức
// ('/') 
// nếu là GET => getCourses
router.route('/').post(protect, createRole);
router.route('/').get(protect, getAll);
// r.get('/', protect.required, getAll)
router.route('/:id').get(getById);
router.route('/:id').put(updateRole);
router.route('/:id').delete(deleteRole);

module.exports = router;