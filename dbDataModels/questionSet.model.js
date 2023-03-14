const { mongoose } = require("../mongoConnection");

const QuestionSetSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },

    dateString: {
        type: String,
        required: true,
    },

    questions: [{
        code: {
            type: String,
            required: true,
        },
        order: {
            type: Number,
            required: true,
        },
    }],

});

const QuestionSet = mongoose.model('QuestionSet', QuestionSetSchema);

module.exports = { QuestionSet }