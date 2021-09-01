const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: function validate(v) {
        return validator.isURL(v);
      },
      message: 'Неправильный формат ссылки картинки',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: function validate(v) {
        return validator.isURL(v);
      },
      message: 'Неправильный формат ссылки трейлера',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: function validate(v) {
        return validator.isURL(v);
      },
      message: 'Неправильный формат ссылки превью',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
