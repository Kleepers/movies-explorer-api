const Movie = require('../models/movie');

const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const userId = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: userId,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.send(err);
        throw new BadRequestError('Переданы некорректные данные для создания фильма');
      }
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const id = req.params.movieId;
  const userId = req.user._id;
  Movie.findById(id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (userId !== movie.owner.toString()) {
        throw new ForbiddenError('Вы пытаетесь удалить чужой фильм');
      } else {
        Movie.findByIdAndDelete(id)
          .then((film) => res.send(film));
      }
    })
    .catch((err) => {
      if (err.statusCode === 404 || err.statusCode === 403) {
        throw err;
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для удаления фильма');
      }
    })
    .catch(next);
};

module.exports.getMovies = (req, res, next) => {
  const id = req.user._id;
  Movie.find({ owner: id })
    .then((movies) => res.send(movies))
    .catch((err) => {
      if (err.statusCode === 404 || err.statusCode === 403) {
        throw err;
      }
    })
    .catch(next);
};
