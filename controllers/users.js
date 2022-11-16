const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('Пользователь не найден'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send('Пользователь не найден');
      } else if (err.statusCode === 404) {
        res.status(404).send('Пользователь не найден');
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate({ _id: userId }, { name, about })
    .orFail(() => new Error('Пользователь не найден'))
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send('Пользователь не найден');
      } else if (err.statusCode === 404) {
        res.status(404).send('Пользователь не найден');
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate({ _id: userId }, { avatar })
    .orFail(() => new Error('Пользователь не найден'))
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send('Пользователь не найден');
      } else if (err.statusCode === 404) {
        res.status(404).send('Пользователь не найден');
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
