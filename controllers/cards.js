const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const Default = require('../errors/Default');
// const NotFound = require('../errors/NotFound');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    throw new Default(err.message);
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
      throw new BadRequest(err.message);
    } else {
      throw new Default(err.message);
    }
  }
};

const deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);

    res.send({ card });
  } catch (err) {
    // throw new NotFound('Карточка с таким id не найдена.');
    res.status(err.status).send(err.message, 'Карточка с таким id не найдена.');
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
      throw new BadRequest('Переданы некорректные данные для постановки/снятии лайка.');
    } else {
      // throw new NotFound('Передан несуществующий _id карточки.');
      res.status(res.status).send({ message: 'Передан несуществующий _id карточки.' });
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
      throw new BadRequest('Переданы некорректные данные для постановки/снятии лайка.');
    } else {
      // throw new NotFound('Передан несуществующий _id карточки.');
      res.status(res.status).send({ message: 'Передан несуществующий _id карточки.' });
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
