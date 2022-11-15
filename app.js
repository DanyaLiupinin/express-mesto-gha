const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

const User = require('./models/user');
const Card = require('./models/card');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(3000);
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '63734d86e6ccdfd6bad397df',
  };

  next();
});

app.get('/users', (req, res) => {
  User.find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get('/users/:userId', (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
});

app.post('/users', (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get('/cards', (req, res) => {
  Card.find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post('/cards', (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.delete('/cards/:cardId', (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});
