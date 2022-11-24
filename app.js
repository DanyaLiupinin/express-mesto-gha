const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(3000);
app.use(bodyParser.json());

/*
app.use((req, res, next) => {
  req.user = {
    _id: '637e3386c66882cbad9d3a16',
  };

  next();
});
*/

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.post('/signin', login);
app.post('/signup', createUser);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});
