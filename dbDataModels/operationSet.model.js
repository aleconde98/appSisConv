const { mongoose } = require("../mongoConnection");

const OperationSetSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },

    dateString: {
        type: String,
        required: true,
    },

    firstNumber: {
        type: Number,
        required: true,
    },

    operations: [{
        order: {
            type: Number,
            required: true,
        },
        number: {
            type: Number,
            required: true,
        },
        operation: {
            type: String,
            required: true,
        },
        answer: {
            type: Number,
            required: true,
        },
    }],

});

const OperationSet = mongoose.model('OperationSet', OperationSetSchema);

module.exports = { OperationSet }