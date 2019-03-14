const express = require('express');
const winston = require('../config/winston');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

// Login user
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {

    if (err) {
      winston.error(`User authentication failed with error ${err}`);
      res.status(400).send({
        message: 'Authentication failed'
      });
      return;
    }

    if (!user) {
      res.status(403).send(info);
      return;
    }
    res.status(200).send({
      message: "User login is successful"
    });
  })(req, res, next);
});


// Signup new user
router.post('/signup', function (req, res, next) {
  const {
    name,
    email,
    password
  } = req.body;

  // Validate if the user already exits
  User.findOne({
      email
    })
    .then(doc => {
      if (doc) {
        res.status(400).send({
          'message': "User email is already being used"
        });
        return;
      }
    });

  bcrypt.genSalt(10, (err, salt) =>
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        console.error('Unable to generate hash', e);
        res.status(500).send({
          'message': 'Unable to create new user'
        });
      }
      hashedPassword = hash;
      createUser(name, email, hashedPassword, res);
    }));

});

const createUser = (name, email, password, res) => {
  // Create a new user
  User.create({
      name,
      email,
      password
    })
    .then(result => {
      console.info('Created user Successfully id=' + result._id);
      res.status(201).send({
        "id": result._id
      });
    })
    .catch(e => {
      console.error('Failed to create new user', e);
      res.status(500).send({
        'message': `Unable to create new user, error: ${e.message}`
      });
    });
}
module.exports = router;