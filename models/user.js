const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: '',
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }) // ищем пользователя с почтой из запроса
    .select(+password)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль')); // если такого нет - отклоянем
      }
      return bcrypt.compare(password, user.password) // сравниваем пароль из запроса и из базы
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user; // возвращаем данные пользователя
        });
    });
};

module.exports = mongoose.model('user', userSchema);
