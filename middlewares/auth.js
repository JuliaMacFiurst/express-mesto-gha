const jwt = require('jsonwebtoken');
// const User = require('../models/user');

const { JWT_SECRET = 'super-strong-secret'} = process.env;

function getJwtToken(user) {
  return jwt.sign({ _id: user._id }, JWT_SECRET);
};

// const isAuthorized = async (token) => {
//   try {
//     const decoded = await jwt.verify(token, JWT_SECRET);
//     return !!decoded;
//   } catch (err) {
//     return false;
//   }
// };

const extractBearerToken = (header) => {
  return header.replace('Bearer ', '');
}
// module.exports = {
//   getJwtToken,
//   isAuthorized,
// };

const auth = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  // console.log(req.headers);
  // убеждаемся, что он есть или начинается с Bearer
  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   // console.log(authorization);
  //   return res
  //     .status(401)
  //     .send({ message: 'Необходима авторизация' });
  // }
  // извлечём токен
  const token = extractBearerToken(authorization);
  console.log(token);
//   // верифицируем токен
  let payload;
  try {
  // попытаемся верифицировать токен
    payload = jwt.verify(token, JWT_SECRET);
    console.log(payload);
  } catch (err) {
    // отправим ошибку, если не получилось
    return res
      .status(401)
      .send({ message: err.message });
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  // console.log(req.user);
  next();
};
module.exports = {
  auth,
  getJwtToken,
};
