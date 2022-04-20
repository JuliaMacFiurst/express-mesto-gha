const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const Default = require('../errors/Default');
const NotFound = require('../errors/NotFound');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (err) {
    throw new Default(err.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.send(
      {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      },
    );
  } catch (err) {
    throw new NotFound('Пользователь по указанному _id не найден. ');
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.send({
      data: {
        name: user.name, about: user.about, avatar: user.avatar,
      },
    });
  } catch (err) {
    throw new BadRequest('Переданы некорректные данные при создании пользователя. ');
  }
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с указанным _id не найден.');
      } else {
        res.send({ name: user.name, about: user.about });
      }
    })
    .catch((err) => {
      if (err) {
        throw new BadRequest('Переданы некорректные данные при обновлении профиля.');
      } else {
        throw new Default(err.message);
      }
    });
};

const updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с указанным _id не найден.');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err) {
        throw new BadRequest(err.message, 'Переданы некорректные данные при обновлении профиля.');
      } else {
        throw new Default(err.message);
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
