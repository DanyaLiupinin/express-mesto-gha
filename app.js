const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(3000);
app.use(bodyParser.json());

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.post('/signin', login);
app.post('/signup', createUser);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.use(errorHandler);
