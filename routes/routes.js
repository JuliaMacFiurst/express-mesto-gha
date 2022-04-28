const express = require('express');
const { usersRoutes } = require('./users');
const { cardsRoutes } = require('./cards');
const { loginRoutes } = require('./login');
const { auth } = require('../middlewares/auth');

const routes = express.Router();
routes.use('/', loginRoutes);

routes.use('/users', auth, usersRoutes);
routes.use('/cards', auth, cardsRoutes);

// Обработаем некорректный маршрут и вернём ошибку 404
routes.use('*', (req, res) => {
  res.status(404).send({ message: `Страницы по адресу ${req.baseUrl} не существует` });
});

exports.routes = routes;
