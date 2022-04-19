const Card = require('../models/card');

const getCards = async (req, res) => {
  const cards = await Card.find({});

  res.send(cards);
  // Card.find({})
  //   .then((cards) => res.status(200).send(cards))
  //   .catch((err) => res.send({ message: err.message }));
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  // Card.create({ name, link, owner })
  //   .then((card) => res.send({ card }))
  //   .catch((err) => res.send({ message: err.message }));

  await Card.create({ name, link, owner });

  res.send({ name, link, owner });
};

const deleteCard = async (req, res) => {
  const card = await Card.findByIdAndRemove(req.params.cardId);

  res.send({ card });

  // Card.findByIdAndRemove(req.params.cardId)
  //   .then((card) => res.send({ card }))
  //   .catch((err) => res.send({ message: err.message }));
};

const likeCard = async (req, res) => {
  const card = await Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  );

  res.send({ card });
};

const dislikeCard = async (req, res) => {
  const card = await Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  );

  res.send({ card });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
