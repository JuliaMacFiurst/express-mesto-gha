const express = require('express');

const routes = express.Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const { cardValidation, idValidation } = require('../middlewares/validate');

routes.get('/cards', getCards);
routes.post('/cards', cardValidation, createCard);
routes.delete('/cards/:_id', idValidation, deleteCard);
routes.put('/cards/:_id/likes', idValidation, likeCard);
routes.delete('/cards/:_id/likes', idValidation, dislikeCard);

exports.cardsRoutes = routes;
