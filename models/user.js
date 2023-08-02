const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля - 2 символа'],
      maxlength: [30, 'Максимальная длина поля - 30 сомволов'],
    },
    about: {
      type: String,
      required: [true, 'Поле должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля - 2 символа'],
      maxlength: [30, 'Максимальная длина поля - 30 сомволов'],
    },
    avatar: {
      type: String,
      required: [true, 'Поле должно быть заполнено'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
