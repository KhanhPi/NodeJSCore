const express = require('express');

// xác thực token
const { protect } = require('../middleware/auth');

// mergeParams: để hợp nhất các tham số
const router = express.Router({ mergeParams: true });

// import các phương thức
const {
    createRole,
    getById,
    getAll
} = require('../controllers/roles');

// Cấu hình router cho các phương thức
// ('/') 
// nếu là GET => getCourses
router.route('/')
    .post(createRole);
router.route('/')
    .get(getAll);
router.route('/:id')
    .get(getById);

module.exports = router;