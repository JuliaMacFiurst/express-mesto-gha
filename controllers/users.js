const User = require('../models/user');
const {
  ERR_BAD_REQUEST,
  ERR_DEFAULT,
  ERR_NOT_FOUND,
} = require('../errors/errors');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (err) {
    res.status(ERR_DEFAULT).send({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.send(
      {
        data: user,
      },
    );
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(ERR_BAD_REQUEST).send({ message: 'Пользователь по указанному _id не найден.' });
    } else {
      res.status(ERR_DEFAULT).send({ message: err.message });
    }
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
    } else {
      res.status(ERR_DEFAULT).send({ message: err.message });
    }
  }
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(ERR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.send({ name: user.name, about: user.about });
      }
    })
    .catch((err) => {
      if (err) {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(ERR_DEFAULT).send({ message: err.message });
      }
    });
};

const updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(ERR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.send({ avatar: user.avatar });
      }
    })
    .catch((err) => {
      if (err) {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(ERR_DEFAULT).send({ message: err.message });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
