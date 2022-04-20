const Card = require('../models/card');
const {
  ERR_BAD_REQUEST,
  ERR_DEFAULT,
  ERR_NOT_FOUND,
} = require('../errors/errors');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    res.status(ERR_DEFAULT).send({ message: err.message });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    await Card.create({ name, link, owner });

    res.send({ name, link, owner });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
    } else {
      res.status(ERR_DEFAULT).send({ message: err.message });
    }
  }
};

const deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);

    res.send({ card });
  } catch (err) {
    res.status(ERR_NOT_FOUND).send({ message: 'Карточка с таким id не найдена.' });
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );

    res.send({ card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
    } else {
      res.status(ERR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
    }
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );

    res.send({ card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
    } else {
      res.status(ERR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
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
