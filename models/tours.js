const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have maxGroupSize']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have difficulty']
  },
  ratingsAverage: {
    type: Number,
    default: 3.0
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: String,
  images: [String],
  startDates: [Date],
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Tours = mongoose.model('Tours', tourSchema);

module.exports = Tours;
