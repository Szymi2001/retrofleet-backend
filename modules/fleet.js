const mongoose = require('mongoose')

const fleetSchema = new mongoose.Schema({
    user_id: {
        type: String,
        require: true
    },
    vin: {
        type: String,
        required: true
    },
    mileage: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    body_type: {
        type: String,
        required: true
    },
    fuel_type: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    is_heritage_listed: {
        type: Boolean,
        required: false
    },
    technical_inspection_date: {
        type: String,
        required: false
    },
    registration_number: {
        type: String,
        required: false
    },
    insurance_expiry_date: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Fleet', fleetSchema)