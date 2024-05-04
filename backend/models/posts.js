// importing mongoose :-
const mongoose = require('mongoose');

// defining schema :-
const postsSchema = new mongoose.Schema({
    file: {
        type: String,
        default: ''
    },
    userId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        default: ''
    },
    likes: [
        {
            userId: {
                type: String,
                required: true,
            },
            userName: {
                type: String,
                required: true,
            },
        },
    ],
    comments: [
        {
            userId: {
                type: String,
                required: true,
            },
            userName: {
                type: String,
                required: true,
            },
            comment: {
                type: String,
                required: true
            }
        },
    ],
    postType: {
        type: String,
        default: 'post'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    contestId: {
        type: String
    }


}, { timestamps: true });

// renaming the collection :-
const Posts = mongoose.model('Posts', postsSchema, 'Posts');

// exporting the Posts :-
module.exports = Posts;
