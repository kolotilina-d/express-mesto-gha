const httpConstans = require('http2').constants;
const { default: mongoose } = require('mongoose');
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(httpConstans.HTTP_STATUS_OK).send(cards))
    .catch(() => res.status(httpConstans.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(httpConstans.HTTP_STATUS_CREATED).send(card);
    })
    .catch((err) => {
      if (err.message) {
        res.status(httpConstans.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(httpConstans.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then(() => {
      res.status(httpConstans.HTTP_STATUS_OK).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(httpConstans.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный _id карточки' });
      } else {
        res.status(httpConstans.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(httpConstans.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(httpConstans.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный _id карточки' });
      } else {
        res.status(httpConstans.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(httpConstans.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(httpConstans.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный _id карточки' });
      } else {
        res.status(httpConstans.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }
    });
};
