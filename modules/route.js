const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
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
  start_location: {
    type: String,
    required: true,
  },
  end_location: {
    type: String,
    required: true,
  },
  distance: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('Route', routeSchema);
