const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { validateCreateUser, validateLogin } = require('../middlewares/validation');

const { createUser, login, logout } = require('../controllers/users');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.delete('/logout', logout);
router.use(() => { throw new NotFoundError('Страница не найдена'); });

module.exports = router;
