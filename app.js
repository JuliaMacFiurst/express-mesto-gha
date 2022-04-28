const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { routes } = require('./routes/routes');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

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

// app.use((req, res, next) => {
//   req.user = {
//     _id: '625dea31d97a31d51b35b76f',
//   };

//   next();
// });

app.use(routes);

async function main() {
  console.log('Try to connect to MongoDB');
  await mongoose.connect('mongodb://localhost:27017/mestodb');
  console.log('Connected');

  app.listen(3000, () => {
    console.log(`Server listen on ${PORT}`);
  });
}

main();
