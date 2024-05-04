// importing mongoose :-
const mongoose = require('mongoose');

// defining schema :-
const contestParticipationSchema = new mongoose.Schema({
    contestId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
    }
}, { timestamps: true });

// renaming the collection :-
const ContestParticipation = mongoose.model('ContestParticipation', contestParticipationSchema, 'ContestParticipation');

// exporting the ContestParticipation :-
module.exports = ContestParticipation;
