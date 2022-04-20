const express = require('express');
const { usersRoutes } = require('./users');
const { cardsRoutes } = require('./cards');

const routes = express.Router();

routes.use('/users', usersRoutes);
routes.use('/cards', cardsRoutes);

routes.use('*', (req, res) => {
  res.status(404).send({ message: `Страницы по адресу ${req.baseUrl} не существует` });
});

exports.routes = routes;
