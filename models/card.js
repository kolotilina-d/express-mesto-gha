const mongoose = require('mongoose');
const { urlRegEx } = require('../utils/constans');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля - 2 символа'],
      maxlength: [30, 'Максимальная длина поля - 30 сомволов'],
    },
    link: {
      type: String,
      required: [true, 'Поле должно быть заполнено'],
      validate: {
        validator(url) {
          return urlRegEx.test(url);
        },
        message: 'Введите корректный URL',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Поле должно быть заполнено'],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: [],
      },
    ],
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardSchema);
