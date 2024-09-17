const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    loginTime: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Log', logSchema)