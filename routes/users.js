const express = require('express');

const routes = express.Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

routes.get('/', getUsers);

routes.get('/:id', getUserById);

routes.get('/me', getCurrentUser);

routes.patch('/me', updateUser);

routes.patch('/me/avatar', updateAvatar);

exports.usersRoutes = routes;
