const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { usersRoutes } = require('./routes/users');
const { cardsRoutes } = require('./routes/cards');
const auth = require('./middlewares/auth');
const { login } = require('./controllers/login');
const { createUser } = require('./controllers/users');
const NOT_FOUND = require('./errors/NOT_FOUND');
const { loginValidation, userValidation } = require('./middlewares/validate');
const { errorOnServer } = require('./errors/SERVER');

const { PORT = 3000 } = process.env;
const app = express();

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', 'true');

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.status(200).send();
  }

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.post('/signin', loginValidation, login);
app.post('/signup', userValidation, createUser);

app.use('/', auth, usersRoutes);
app.use('/', auth, cardsRoutes);

// Обработаем некорректный маршрут и вернём ошибку 404
app.use('*', () => {
  throw new NOT_FOUND('Запрашиваемый ресурс не найден');
});

app.use(errors());

app.use(errorOnServer);

async function main() {
  console.log('Try to connect to MongoDB');
  await mongoose.connect('mongodb://localhost:27017/mestodb');
  console.log('Connected');

  app.listen(3000, () => {
    console.log(`Server listen on ${PORT}`);
  });
}

main();
