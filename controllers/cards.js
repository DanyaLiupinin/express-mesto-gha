const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
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

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error('Карточка не найдена'))
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send('Неверный id карточки');
      } else if (err.statusCode === 404) {
        res.status(404).send('Карточка не найдена');
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const putLike = (req, res) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: userId } }, { new: true })
    .orFail(() => new Error('Карточка не найдена'))
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send('Неверный id карточки');
      } else if (err.statusCode === 404) {
        res.status(404).send('Карточка не найдена');
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const deleteLike = (req, res) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => new Error('Карточка не найдена'))
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send('Неверный id карточки');
      } else if (err.statusCode === 404) {
        res.status(404).send('Карточка не найдена');
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
