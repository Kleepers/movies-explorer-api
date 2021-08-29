const router = require('express').Router();
const { validateCreateMovie } = require('../middlewares/validation');
const {
  createMovie, deleteMovie, getMovies,
} = require('../controllers/movies');

router.post('/', validateCreateMovie, createMovie);
router.delete('/:movieId', deleteMovie);
router.get('/', getMovies);

module.exports = router;
