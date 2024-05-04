// importing mongoose :-
const mongoose = require('mongoose');

// defining schema :-
const adminSchema = new mongoose.Schema({
    name: {
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
        required: true,
    },
    image: {
        type: String,
        default: '',
    },
    deviceType: {
        type: String,
        default: 'a',
        enum: ['a', 'i'],
    },
    isActive: {
        type: Boolean,
        default: true,
        enum: [true, false],
    },
    isOnBoardingCompleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// renaming the collection :-
const Admin = mongoose.model('Admin', adminSchema, 'Admin');

// exporting the Admin :-
module.exports = Admin;