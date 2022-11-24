const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(() => {
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
        res.status(400).send({ message: 'Пользователь не найден' });
      } else if (err.message === 'Пользователь не найден') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
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
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate({ _id: userId }, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => new Error('Пользователь не найден'))
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else if (err.message === 'Пользователь не найден') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate({ _id: userId }, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => new Error('Пользователь не найден'))
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Пользователь не найден' });
      } else if (err.message === 'Пользователь не найден') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password) // отсюда приходят данные авторизированного юзера
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'very-secret-key', { expiresIn: '7d' }); // код шифрования поменять // создаем jwt
      res.cookie('jwt', token, { // записываем в куку // ToDO поменять жизнь jwt 7 дней
        maxAge: 3600000, // разобраться сколько должна жить кука
        httpOnly: true,
      });
      res.send({ token }); // отсылаем jwt пользователю
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

const getCurrentUser = (req, res, next) => { // next ???
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return next(new Error('Пользователь не найден'));
      }
      return res.status(200).send({ data: user });
    })
    .catch(next); // next ?? так?
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
