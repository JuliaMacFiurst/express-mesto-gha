const User = require('../models/user');

const getUsers = async (req, res) => {
  // User.find({})
  //   .then((users) => res.send({ data: users }))
  //   .catch((err) => res.status(500).send({ message: err.message }));
  const users = await User.find({});

  res.send(users);
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);

  res.send(user);
  // User.findById(req.params._id)
  //   .then((user) => {
  //     res.send({ data: user });
  //   })
  //   .catch((err) => {
  //     res.status(500).send({ message: err.message });
  //   });
};

const createUser = async (req, res) => {
  const user = await User.create(req.body);

  res.send({
    data: {
      name: user.name, about: user.about, avatar: user.avatar,
    },
  });
  // const { name, about, avatar } = req.body;

  // User.create({ name, about, avatar })
  //   .then((user) => res.send({
  //     data: {
  //       name: user.name, about: user.about, avatar: user.avatar,
  //     },
  //   }))
  //   .catch((err) => {
  //     res.status(500).send({ message: err.message });
  //   });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err) {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

const updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err) {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else {
        res.status(500).send({ message: err.message });
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
