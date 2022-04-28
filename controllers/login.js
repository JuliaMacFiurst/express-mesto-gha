const bcrypt = require('bcrypt');

const User = require('../models/user');

const { getJwtToken } = require('../middlewares/auth');
const {
  ERR_DEFAULT,
} = require('../errors/errors');

function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send({ message: 'Email или пароль не могут быть пустыми.' });
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) return res.status(401).send({ message: 'Неправильная почта или пароль.' });
      return bcrypt.compare(password, user.password)
        .then((isValidPassword) => {
          if (!isValidPassword) return res.status(401).send({ message: 'Неправильная почта или пароль.' });
          const token = getJwtToken(user.id);
          return res.status(200).send({ token });
        });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
}

// const login = (req, res) => {
// // const { email, password } = req.body;
// // if(!email || password) return res.status(400).send({ message: })

// //   const { email, password } = req.body;

// //   return User.findUserByCredentials(email, password)
// //     .then((user) => {
// //       const token = jwt.sign(
// //         { _id: user._id },
// //         NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
// //         { expiresIn: '7d' },
// //       );

// //       res.cookie('jwt', token, {
// //         maxAge: 3600000 * 24 * 7,
// //         httpOnly: true,
// //       })
// //         .send({ message: 'Авторизация прошла успешно!' });
// //     })
// //     .catch(next);
// // };


//   const { email, password } = req.body;
//   User.findOne({ email }).select('+password')
//     .orFail(() => {
//       // такого email в базе нет
//       res.status(401).send({ message: 'Неправильная почта или пароль.' });
//     })
//     .then((user) => {
//       // Проверяем пароль
//       bcrypt.compare(password, user.password)
//         .then((matched) => {
//           if (!matched) {
//             // Хэши не совпали
//             res.status(401).send({ message: 'Неправильная почта или пароль.' });
//           }
//           // Создаем токен и отправляем пользователю
//           const token = getJwtToken(user._id);

//           res.cookie('jwt', token, {
//             maxAge: 3600000 * 24 * 7,
//             httpOnly: true,
//           });
//           res.send({ token });
//         })
//         .catch((err) => {
//           if (err.statusCode === 401) {
//             next(err);
//           } else {
//             res.status(ERR_DEFAULT).send({ message: err.message });
//           }
//         });
//     })
//     .catch((err) => {
//       if (err.statusCode === 401) {
//         next(err);
//       } else {
//         res.status(ERR_DEFAULT).send({ message: err.message });
//       }
//     });
// };

module.exports = {
  login,
};
