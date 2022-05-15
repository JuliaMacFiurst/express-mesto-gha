const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const User = require('../models/user');
const BAD_REQUEST = require('../errors/BAD_REQUEST');
const NOT_FOUND = require('../errors/NOT_FOUND');
const CONFLICT = require('../errors/Conflict');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    res.send({ data: users });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params._id);

    if (!user) {
      throw new NOT_FOUND('Пользователь по указанному _id не найден.');
    } else {
      res.send({ data: user });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BAD_REQUEST('Передан некорректный _id пользователя.'));
    }
    next(err);
  }
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        throw new CONFLICT('Такой пользователь уже существует.');
      } else if (err.name === 'ValidationError') {
        throw new BAD_REQUEST(err.message);
      } else {
        next(err);
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BAD_REQUEST(err.message));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NOT_FOUND('Пользователь по указанному _id не найден.'))
    .then((currentUser) => res.send({ currentUser }))
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((avatarData) => res.send({ data: avatarData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BAD_REQUEST(err.message));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  getCurrentUser,
  updateAvatar,
};
