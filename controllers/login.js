const bcrypt = require('bcrypt');

const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  ERR_DEFAULT,
} = require('../errors/errors');

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(() => {
      // такого email в базе нет
      res.status(401).send({ message: 'Неправильная почта или пароль.' });
    })
    .then((user) => {
      // Проверяем пароль
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // Хэши не совпали
            res.status(401).send({ message: 'Неправильная почта или пароль.' });
          }
          // Создаем токен и отправляем пользователю
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'strongest-key-ever',
            { expiresIn: '7d' },
          );
          res.send({ token });
        })
        .catch((err) => {
          if (err.statusCode === 401) {
            next(err);
          } else {
            res.status(ERR_DEFAULT).send({ message: err.message });
          }
        });
    })
    .catch((err) => {
      if (err.statusCode === 401) {
        next(err);
      } else {
        res.status(ERR_DEFAULT).send({ message: err.message });
      }
    });
};

module.exports = {
  login,
};
