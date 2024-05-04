// importing mongoose :-
const mongoose = require('mongoose');

// defining schema :-
const chatSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        require: true,
    },
    receiverName: {
        type: String,
        require: true
    },
    receiverId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
}, { timestamps: true });

// renaming the collection :-
const Chat = mongoose.model('Chat', chatSchema, 'Chat');

// exporting the User :-
module.exports = Chat;
