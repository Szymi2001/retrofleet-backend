const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    allDay: {
        type: Boolean,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Event', eventSchema)