const Card = require('../models/card');
const BAD_REQUEST = require('../errors/BAD_REQUEST');
const NOT_FOUND = require('../errors/NOT_FOUND');
const FORBIDDEN = require('../errors/Forbidden');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;

    const card = await Card.create({ name, link, owner });
    res.send({ card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      throw new BAD_REQUEST(err.message);
    } else {
      next(err);
    }
  }
};

const deleteCard = (req, res, next) => {
  const userId = req.user._id;
  const { _id } = req.params;

  Card.findById(_id)
    .orFail()
    .catch(() => {
      throw new NOT_FOUND('Карточка с указанным _id не найдена.');
    })
    .then((card) => {
      if (card.owner.toString() === userId) {
        Card.findByIdAndRemove(_id)
          .then((cardData) => res.send(cardData));
      } else {
        throw new FORBIDDEN('Нет прав для удаления карточки');
      }
    })
    .catch(next);
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params._id,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!card) {
      throw new NOT_FOUND('Передан несуществующий _id карточки.');
    } else {
      res.send({ card });
    }
  } catch (err) {
    next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params._id,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    if (!card) {
      throw new NOT_FOUND('Передан несуществующий _id карточки.');
    } else {
      res.send({ card });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      throw new BAD_REQUEST('Переданы некорректные данные для снятии лайка.');
    } else {
      next(err);
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
