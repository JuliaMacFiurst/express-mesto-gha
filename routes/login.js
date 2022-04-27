const express = require('express');

const routes = express.Router();

const { createUser } = require('../controllers/users');
const { login } = require('../controllers/login');

routes.post('/signin', login);
routes.post('/signup', createUser);

exports.loginRoutes = routes;
