const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { routes } = require('./routes/routes');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.method, req.path);
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
