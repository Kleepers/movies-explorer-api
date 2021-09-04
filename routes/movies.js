const router = require('express').Router();
const { validateCreateMovie, validateObjectId } = require('../middlewares/validation');
const {
  createMovie, deleteMovie, getMovies,
} = require('../controllers/movies');

router.post('/', validateCreateMovie, createMovie);
router.delete('/:movieId', validateObjectId, deleteMovie);
router.get('/', getMovies);

module.exports = router;
