const Card = require('../models/card');
const BAD_REQUEST = require('../errors/BAD_REQUEST');
const NOT_FOUND = require('../errors/NOT_FOUND');
const FORBIDDEN = require('../errors/Forbidden');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;

    const card = await Card.create({ name, link, owner });
    res.send({ data: card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BAD_REQUEST(err.message));
    } else {
      next(err);
    }
  }
};

const deleteCard = (req, res, next) => {
  const userId = req.user._id;
  const { _id } = req.params;

  Card.findById(_id)
    .orFail(() => new NOT_FOUND('Карточка с указанным _id не найдена.'))
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new FORBIDDEN('Нет прав для удаления карточки');
      } else {
        return Card.findByIdAndRemove(_id)
          .then((cardData) => res.send(cardData));
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NOT_FOUND('Карточка с таким id не найдена');
    })
    .then((likes) => res.send({ data: likes }))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new NOT_FOUND('Карточка с таким id не найдена');
    })
    .then((likes) => res.send({ data: likes }))
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
