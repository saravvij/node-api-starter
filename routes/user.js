const express = require('express');
const logger = require('../config/logger');
const passport = require('passport');
const router = express.Router();

// Login user
router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        logger.error(info);
        return res.status(403).send({
          'message': info.message
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
        const token = await user.generateAuthToken();

        //Send back the token to the user
        return res.json({
          token
        });
      });
    } catch (error) {
      logger.error(error);
      return next(error);
    }
  })(req, res, next);
});

//When the user sends a post request to this route, passport authenticates the user based on the
//middleware created previously
router.post('/signup', passport.authenticate('signup', {
  session: false
}), async (req, res, next) => {
  // Generate Auth Token
  const token = await req.user.generateAuthToken();
  res.json({
    message: 'Signup successful',
    user: {
      "_id": req.user._id,
      "email": req.user.email
    },
    token
  });
});



module.exports = router;