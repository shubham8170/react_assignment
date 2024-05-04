// importing mongoose :-
const mongoose = require('mongoose');

// defining schema :-
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    lastname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    gender: {
        type: String,
        required: false
    },
    dob: {
        type: Date,
        required: false
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user'],
    },
    isActive: {
        type: Boolean,
        default: true,
        enum: [true, false],
    },
    isSuspended: {
        type: Boolean,
        default: false,
        enum: [true, false],
    },
}, { timestamps: true });

// renaming the collection :-
const User = mongoose.model('User', userSchema, 'User');

// exporting the User :-
module.exports = User;
