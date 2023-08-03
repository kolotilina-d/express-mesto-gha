const httpConstans = require('http2').constants;
const { default: mongoose } = require('mongoose');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(httpConstans.HTTP_STATUS_OK).send(users))
    .catch(() => {
      res.status(httpConstans.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере прозошла ошибка' });
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(httpConstans.HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.CastError) {
        res.status(httpConstans.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректрый _id пользователя' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(httpConstans.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь не найден в базе' });
      } else {
        res.status(httpConstans.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере прозошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(httpConstans.HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(httpConstans.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(httpConstans.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(httpConstans.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(httpConstans.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(httpConstans.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.editAvatar = (req, res) => {
  const { avatar } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(httpConstans.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
        } else {
          res.status(httpConstans.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь не найден в базе' });
        }
      });
  } else {
    res.status(httpConstans.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};
