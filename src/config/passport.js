const localStrategy = require('passport-local').Strategy;
const {
    createUser,
    findUserByEmail,
    isValidPassword
} = require('../user/user.service');
const logger = require('./logger');

module.exports = (passport) => {
    //Create a passport middleware to handle user registration
    passport.use('signup', new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            //Save the information provided by the user to the the database
            const user = await createUser({
                email,
                password
            });
            //Send the user information to the next middleware
            return done(null, user, {
                message: 'Signup Successful'
            });
        } catch (error) {
            return done(error, false, {
                message: error
            });
        }
    }));

    //Create a passport middleware to handle User login
    passport.use('login', new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {

        try {
            //Find the user associated with the email provided by the user
            const user = await findUserByEmail(email);

            if (!user) {
                //If the user isn't found in the database, return a message
                return done({
                    message: 'User not found'
                }, false, {});
            }

            //Validate password and make sure it matches with the corresponding hash stored in the database
            //If the passwords match, it returns a value of true.
            const validate = await isValidPassword(user, password);
            if (!validate) {
                return done({
                    message: 'Wrong Password'
                }, false, {});
            }

            //Send the user information to the next middleware
            return done(null, user, {
                message: 'Logged in Successfully'
            });

        } catch (error) {
            logger.error("passport.js" + error);
            return done(error);
        }
    }));
}