require('dotenv').config();
const config = require('./config');
const logger = require('./config/logger');
const morgan = require('morgan');
const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const responseTime = require('response-time');

logger.info('Loaded environment = %s', config.get('env'));
const db = require('./db');

// Passport setup
const passport = require('passport');
require('./config/passport')(passport);

const userRouter = require('./user/user.router');

const app = express();

app.use(responseTime());
app.use(
  morgan('combined', {
    stream: logger.stream
  })
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(cors());
app.options('*', cors());
app.use(passport.initialize());

// Routes
app.use('/api/users', userRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use(function (err, req, res, next) {

  const status = err.status || 500;
  const message = err.message || 'Sorry!, System is unable to handle your request, Please try again.';
  const timestamp = err.timestamp || new Date();
  const path = req.path;
  const error = {
    status,
    message,
    timestamp,
    path
  }

  logger.error(error);

  // render the error page
  res.status(status);
  res.send({
    status,
    message,
    timestamp,
    path
  });
  res.send(err);
});

module.exports = app;