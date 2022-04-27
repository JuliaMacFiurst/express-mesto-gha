const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String, // тип — String
    default: 'Исследователь ',
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: (props) => `${props.value} - некорректный email`,
    },
  },
  password: {
    type: String,
    required: true,
    unique: true,
    select: false,
  },
});
// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);

// User.findOne({ email })
//     .then((user) => {
//       if (user) {
//         return res.status(409).send({ message: 'Такой пользователь уже существует' });
//       }
