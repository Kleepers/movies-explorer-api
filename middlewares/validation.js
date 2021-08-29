const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

const validateUrl = (url) => {
  const result = validator.isURL(url);
  if (result) {
    return url;
  }
  throw new Error('Неверная ссылка');
};

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).messages({
      'string.pattern.base': 'В поле "email" нужно ввести электронную почту',
      'string.empty': 'Поле "email" должно быть заполнено',
    }),
    password: Joi.string().required().min(8).messages({
      'string.min': 'Минимальная длина поля "password" - 8',
      'string.empty': 'Поле "password" должно быть заполнено',
    }),
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля "name" - 2',
      'string.max': 'Максимальная длина поля "name" - 30',
      'string.empty': 'Поле "name" должно быть заполнено',
    }),
  }, { abortEarly: false }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).messages({
      'string.pattern.base': 'В поле "email" нужно ввести электронную почту',
      'string.empty': 'Поле "email" должно быть заполнено',
    }),
    password: Joi.string().required().min(8).messages({
      'string.min': 'Минимальная длина поля "password" - 8',
      'string.empty': 'Поле "password" должно быть заполнено',
    }),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).messages({
      'string.pattern.base': 'В поле "email" нужно ввести электронную почту',
      'string.empty': 'Поле "email" должно быть заполнено',
    }),
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля "name" - 2',
      'string.max': 'Максимальная длина поля "name" - 30',
      'string.empty': 'Поле "name" должно быть заполнено',
    }),
  }),
});

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().messages({ 'string.empty': 'Поле "country" должно быть заполнено' }),
    director: Joi.string().required().messages({ 'string.empty': 'Поле "director" должно быть заполнено' }),
    duration: Joi.number().required().messages({
      'number.empty': 'Поле "duration" должно быть заполнено',
      'number.base': 'Поле "duration" должно быть числом',
    }),
    year: Joi.number().required().messages({
      'number.empty': 'Поле "year" должно быть заполнено',
      'number.base': 'Поле "year" должно быть заполнено',
    }),
    description: Joi.string().required().messages({ 'string.required': 'Поле "description" должно быть заполнено' }),
    image: Joi.string().required().custom(validateUrl).messages({
      'string.empty': 'Невалидная ссылка "image"',
    }),
    trailer: Joi.string().required().custom(validateUrl).messages({
      'string.empty': 'Невалидная ссылка "trailer"',
    }),
    thumbnail: Joi.string().required().custom(validateUrl).messages({
      'string.empty': 'Невалидная ссылка "thumbnail"',
    }),
    movieId: Joi.string().required().messages({
      'string.empty': 'Поле "movieId" должно быть заполнено',
    }),
    nameRU: Joi.string().required().messages({
      'string.empty': 'Поле "nameRU" должно быть заполнено',
    }),
    nameEN: Joi.string().required().messages({
      'string.empty': 'Поле "nameEN" должно быть заполнено',
    }),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateUserUpdate,
  validateCreateMovie,
};
