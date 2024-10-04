const mongoose = require('mongoose')

const fuelingSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    car_id: {
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
    price: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    mileage: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
    },
    fuelType: {
        type: String,
        required: true
    },
    fuelAmount: {
        type: Number,
        required: true
    },
    transactionType: {
        type: String,
        required: true
    },
    receiptNumber: {
        type: Number,
        required: false
    }
})

module.exports = mongoose.model('Fueling', fuelingSchema)