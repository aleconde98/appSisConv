const { mongoose } = require("../mongoConnection");

const QuestionSchema = new mongoose.Schema({

    code: {
        type: String,
        required: true,
        unique: true,
    },

    text: {
        type: String,
        required: true,
    },

    answers: [{
        id: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        synonyms: {
            type: [String],
            required: true,
        },
    }],

    correctAnswer: {
        type: String,
        required: true,
    },

});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = { Question }