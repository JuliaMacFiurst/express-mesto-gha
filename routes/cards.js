const express = require('express');

const routes = express.Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

routes.get('/', getCards);

routes.post('/', createCard);

routes.delete('/:cardId', deleteCard);

routes.put('/:cardId/likes', likeCard);

routes.delete('/:cardId/likes', dislikeCard);

exports.cardsRoutes = routes;
