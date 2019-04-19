const express = require('express');
const logger = require('../config/logger');
const passport = require('passport');
const {
  generateAuthToken
} = require('./user.service');
const router = express.Router();


const handleAuth = async (req, res, next, type) => {
  passport.authenticate(type, async (err, user, info) => {
    try {
      if (err || !user) {
        return res.status(400).send({
          message: err ? err.message : type + ' is failed'
        });
      }

      req.login(user, {
        session: false
      }, async (error) => {
        if (error) {
          logger.error(error);
          return next(error);
        }

        // Generate Auth Token
        const token = await generateAuthToken(user);

        const status = type === 'signup' ? 201 : 200;

        //Send back the token to the user
        return res.status(status).json({
          id: user._id,
          token
        });
      });
    } catch (error) {
      logger.error(error);
      return next(error);
    }
  })(req, res, next);
}

router.post('/login', (req, res, next) => handleAuth(req, res, next, 'login'));
router.post('/signup', (req, res, next) => handleAuth(req, res, next, 'signup'));

module.exports = router;