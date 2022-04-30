const bcrypt = require('bcrypt');


const SALT_ROUNDS = 10;
const User = require('../models/user');
// const { isAuthorized } = require('../middlewares/auth');
const {
  ERR_BAD_REQUEST,
  ERR_DEFAULT,
  ERR_NOT_FOUND,
} = require('../errors/errors');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (err) {
    res.status(ERR_DEFAULT).send({ message: err.message });
  }
  next();
};
//   // const { authorization } = await req.headers;
//   // if (!authorization) {
//     console.log(authorization);
//     return res.status(401).send({ message: 'Необходима авторизация' });
//   }
//   return User.find({})
//     .then((users) => res.status(200).send(users))
//     .catch((err) => res.status(ERR_DEFAULT).send({ message: err.message }));
// };

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(ERR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
    } else {
      res.send({ user });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(ERR_BAD_REQUEST).send({ message: 'Передан некорректный _id пользователя.' });
    } else {
      res.status(ERR_DEFAULT).send({ message: err.message });
    }
  }
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) return res.status(400).send({ message: 'Email или пароль не могут быть пустыми.' });
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.status(409).send({ message: 'Такой пользователь уже существует.' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(ERR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err) {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(ERR_DEFAULT).send({ message: err.message });
      }
    })
    .catch(next);
};
//   const { name, about } = req.body;
//   const userId = req.user._id;

//   User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
//     .then((user) => res.send({ data: user }))
//     .catch((err) => {
//       if (err) {
//                 res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
//               } else {
//                 res.status(ERR_DEFAULT).send({ message: err.message });
//               }
//             });
// };

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .catch(() => {
      res.status(ERR_NOT_FOUND).send({ message: 'Пользователь по заданному ID отсутствует в базе данных' });
    })
    .then((currentUser) => res.send({ currentUser }))
    .catch(next);
};

// const getCurrentUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id)
//       .orFail(() => {
//         res.status(ERR_NOT_FOUND).send({ message: 'Пользователь по заданному ID отсутствует в базе данных' });
//       });

//     res.send({ data: user });
//   } catch (err) {
//     if (err.name === 'CastError') {
//       res.status(ERR_BAD_REQUEST).send({ message: 'Ошибка в формате ID пользователя' });
//     } else if (err.statusCode === ERR_NOT_FOUND) {
//       res.status(ERR_NOT_FOUND).send({ message: 'Пользователь не найден.' });
//     } else {
//       res.status(ERR_DEFAULT).send({ message: err.message });
//     }
//   }
// };

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
  getCurrentUser,
};
