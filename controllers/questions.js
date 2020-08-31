const path = require('path');
const Question = require('../models/questions');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Create new question
// @route   POST /api/question
exports.createQuestion = asyncHandler(async(req, res, next) => {
    const question = await Question.create(req.body);

    res.status(201).json({
        success: true,
        data: question
    });
});

// @desc    get list question by number question
// @route   GET /api/question
exports.getQuestions = asyncHandler(async(req, res, next) => {
    console.log("test", req.params.size)
    const question = await Question.find().limit(req.body.size);

    res.status(201).json({
        success: true,
        data: question
    });
});