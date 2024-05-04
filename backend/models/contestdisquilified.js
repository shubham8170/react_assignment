// importing mongoose :-
const mongoose = require('mongoose');

// defining schema :-
const contestDisqualifiedUserSchema = new mongoose.Schema({
    contestId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
}, { timestamps: true });

// renaming the collection :-
const ContestDisqualifiedUsers = mongoose.model('ContestDisqualifiedUsers', contestDisqualifiedUserSchema, 'ContestDisqualifiedUsers');

// exporting the ContestParticipation :-
module.exports = ContestDisqualifiedUsers;
