const logger = require('../config/logger');
const brcypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const userModel = require('./user.model')

const UserService = {

    async createUser(user) {
        return await userModel.create(user);
    },

    async findUserByEmail(email) {
        return userModel.findOne({
            email
        });
    },

    /**
     * Hashes the password sent by the user for login and checks if the hashed password stored in the 
     * database matches the one sent. Returns true if it does else false.
     */
    async isValidPassword(user, password) {
        return await brcypt.compare(password, user.password);
    },

    async generateAuthToken(user) {
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        //Sign the JWT token and populate the payload with the user email and id
        const token = jwt.sign({
            _id: user._id.toString(),
            email: user.email
        }, config.get('jwt.secret'));

        return token;
    },
}

module.exports = UserService;