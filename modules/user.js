const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    surname: {
        type: String,
        required: false
    },
    first_question: {
        type: String,
        required: false
    },
    first_answer: {
        type: String,
        required: false
    },
    second_question: {
        type: String,
        required: false,
    },
    second_answer: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('User', userSchema)