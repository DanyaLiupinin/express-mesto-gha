const cardRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

cardRouter.get('/', getCards);

cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/(www\.)?\d?\D{1,}#?/),
  }),
}), createCard);

cardRouter.delete('/:cardId', celebrate({
  body: Joi.object().keys({
    params: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
    }),
  }),
}), deleteCard);

cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), putLike);

cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), deleteLike);

module.exports = cardRouter;
