const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauth-err');

const { JWT_SECRET = 'crimson group' } = process.env;

module.exports.getUser = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.statusCode === 404 || err.statusCode === 403) {
        throw err;
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      throw err;
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  return User.findOne({ email })
    .then((userChecked) => {
      if (userChecked) {
        throw new ConflictError('Существует пользователь с таким email');
      } else {
        return User.findByIdAndUpdate(req.user._id,
          { email, name }, { new: true, runValidators: true })
          .then((user) => {
            if (!user) {
              throw new NotFoundError('Пользователь не найден');
            }
            res.send(user);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные для обновления профиля');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для обновления профиля');
      }
      throw err;
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    })
      .then((user) => res.send({
        email: user.email,
        name: user.name,
        _id: user._id,
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestError('Переданы некорректные данные для создания пользователя');
        }
        if (err.name === 'MongoError' && err.code === 11000) {
          throw new ConflictError('Адрес электронной почты уже используется.');
        }
        throw err;
      }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          httpOnly: true,
          expires: new Date(Date.now() + 8 * 3600000),
        })
        .send({ message: 'Логин прошел успешно' });
    })
    .catch(() => { throw new UnauthorizedError('Неправильные почта или пароль'); })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt').status(200).send({ message: 'Токен удалён' });
  res.sendStatus(200);
};
