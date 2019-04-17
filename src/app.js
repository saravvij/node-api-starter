require('dotenv').config();
const config = require('./config');
const logger = require('./config/logger');
const morgan = require('morgan');
const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

logger.info("Loaded environment = %s", config.get('env'));

const db = require('./db');

// Passport setup
const passport = require('passport');
require('./config/passport')(passport);

const userRouter = require('./user/user.router');

const app = express();

app.use(morgan('combined', {
  stream: logger.stream
}));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.send({
    status: err.status,
    message: res.locals.message
  });
});

module.exports = app;