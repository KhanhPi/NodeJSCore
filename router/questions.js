const express = require('express');

const router = express.Router();

// import các phương thức
const {
    createQuestion,
    getQuestions
} = require('../controllers/questions');

// Cấu hình router cho các phương thức
// ('/') 
// nếu là POST => createQuestion
router.route('/')
    .get(getQuestions)
    .post(createQuestion);

module.exports = router;