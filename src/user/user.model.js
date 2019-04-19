const mongoose = require('mongoose');
const validator = require('validator');
const brcypt = require('bcrypt');

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

UserSchema.post('save', function (error, doc, next) {
    const user = this;
    if (error.code === 11000)
        next(new Error('The username ' + user.email + ' already exists, please try with different name.'));
    else next(error);
});

module.exports = mongoose.model('User', UserSchema);