const httpConstans = require('http2').constants;
const express = require('express');
const mongoose = require('mongoose');

const router = require('./routes/index');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '64c92fc2cbd39e86cddb2028',
  };

  next();
});

app.use(router);

app.all('/*', (req, res) => {
  res.status(httpConstans.HTTP_STATUS_NOT_FOUND).json({ message: 'Not Found' });
});

app.listen(PORT);
