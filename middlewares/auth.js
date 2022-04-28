const jwt = require('jsonwebtoken');

const JWT_SECRET = 'super-mega-extra-srong-key';

function getJwtToken(id) {
  return jwt.sign({ id }, JWT_SECRET);
};

const isAuthorized = async (token) => {
  try {
    const decoded = await jwt.verify(token, JWT_SECRET);
    return !!decoded;
  } catch (err) {
    return false;
  }
};

const extractBearerToken = (header) => {
  return header.replace('Bearer ', '');
};
// module.exports = {
//   getJwtToken,
//   isAuthorized,
// };

const auth = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  // извлечём токен
  const token = extractBearerToken(authorization);
//   // верифицируем токен
  let payload;
  try {
//     // попытаемся верифицировать токен
    payload = isAuthorized(token);
  } catch (err) {
    // отправим ошибку, если не получилось
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next();
};
module.exports = {
  auth,
  getJwtToken,
};
