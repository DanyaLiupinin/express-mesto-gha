const jwt = require('jsonwebtoken');
const UnauthorizatedError = require('../errors/UnauthorizedError');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers; // извлекаем заголовок с авторизацией из запрсоа
  if (!authorization || !authorization.startsWith('Bearer ')) { // проверяем есть ли он и с чего начинается
    next(new UnauthorizatedError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', ''); // выкидываем из заголовка bearer
  let payload;
  try {
    payload = jwt.verify(token, 'very-secret-key'); // верифицирует токен и возвращает пэйлоуд
  } catch (err) {
    next(new UnauthorizatedError('Необходима авторизация'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
