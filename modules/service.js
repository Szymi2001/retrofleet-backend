const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  car_id: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  isoDate: {
    type: String,
    required: true,
  },
  mileage: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Service', serviceSchema);
