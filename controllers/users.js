const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const status = require('../utils/status');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((data) => {
      res.status(status.OK).send(data);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
        return;
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
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
        .then((user) => {
          res.status(status.CREATED).send({
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
            _id: user._id,
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Некорректные данные'));
            return;
          }
          if (err.code === 11000) {
            next(new ConflictError('Email уже используется'));
            return;
          }
          next(err);
        });
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate({ _id: userId }, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((data) => {
      res.status(status.OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
        return;
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate({ _id: userId }, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((data) => {
      res.status(status.OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
        return;
      }

      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password) // отсюда приходят данные авториз юзер
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }); // код шифрования поменять // создаем jwt
      res.send({ token }); // отсылаем jwt пользователю
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      if (!user) {
        return next(new Error('Пользователь не найден'));
      }
      return res.status(status.OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
        return;
      }
      next(err);
    });
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
