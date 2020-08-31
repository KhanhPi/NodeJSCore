const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    answers: {
        type: Array,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Question', QuestionSchema);