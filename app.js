const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(3000);
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '63734d86e6ccdfd6bad397df',
  };

  next();
});

app.all('/*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});
app.use(userRouter);
app.use(cardRouter);
