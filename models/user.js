const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
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

module.exports = mongoose.model('User', userSchema);