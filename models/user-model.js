const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1
    },
    email: {
        type: String,
        required: true,
        minlength: 3
    }
});

module.exports = mongoose.model('UserModel', userSchema);