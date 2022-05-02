const express = require('express');

const routes = express.Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

const { userAboutValidation, avatarValidation, idValidation } = require('../middlewares/validate');

routes.get('/users', getUsers);
routes.get('/users/me', getCurrentUser);
routes.get('/users/:_id/', idValidation, getUserById);
routes.patch('/users/me', userAboutValidation, updateUser);
routes.patch('/users/me/avatar', avatarValidation, updateAvatar);

exports.usersRoutes = routes;
