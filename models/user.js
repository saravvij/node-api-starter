const mongoose = require('mongoose');
const validator = require('validator');
const brcypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: false,
        minlength: 1,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },

    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 3,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    }
});

//This is called a pre-hook middleware, before the user information is saved in the database
//this function will be called, we'll get the plain text password, hash it and store it.
UserSchema.pre('save', async function (next) {

    //'this' refers to the current document about to be saved
    const user = this;

    //Hash the password with a salt round of 10, the higher the rounds the more secure, but the slower
    const hash = await brcypt.hash(this.password, 10);

    //Replace the plain text password with the hash and then store it
    this.password = hash;

    //Indicates we're done and moves on to the next middleware
    next();
});

/**
 * Hashes the password sent by the user for login and checks if the hashed password stored in the 
 * database matches the one sent. Returns true if it does else false.
 */
UserSchema.methods.isValidPassword = async function (password) {
    const user = this;
    const compare = await brcypt.compare(password, user.password)
    return compare;
}

UserSchema.methods.generateAuthToken = async function () {
    const user = this;
    //We don't want to store the sensitive information such as the
    //user password in the token so we pick only the email and id
    //Sign the JWT token and populate the payload with the user email and id
    const token = jwt.sign({
        _id: user._id.toString(),
        email: user.email
    }, 'top_secret');

    return token;

}

module.exports = mongoose.model('User', UserSchema);