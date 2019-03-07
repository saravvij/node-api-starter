const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, (email, password, done) => {

    // eslint-disable-next-line no-console
    console.log('Matching user email');

    // Match User
    User.findOne({
        email
      })
      .then(user => {
        if (!user) {
          return done(null, false, {
            message: 'The provided email is not registered'
          });
        }
        // Match Password
        return bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;

          if (isMatch) return done(null, user);

          return done(null, false, {
            message: 'Password is incorrect'
          });
        });
      });
  }));
};