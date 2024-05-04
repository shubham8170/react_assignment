const mongoose = require('mongoose');

const contestStepSchema = new mongoose.Schema({
    likes: {
        type: Number,
        required: true,
    },
    expireAt: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

const contestSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    contestDescription: {
        type: String,
    },
    contestName: {
        type: String,
        required: true,
    },
    expireAt: {
        type: Date,
        required: true,
    },
    contestTotalround: {
        type: Number,
        required: true,
    },
    contestCurrentround: {
        type: Number,
        default: 1,
    },
    isExpired: {
        type: Boolean,
        default: false,
    },
    contestSteps: {
        type:[contestStepSchema]
    }, 
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const Contest = mongoose.model('Contest', contestSchema, 'Contest');

module.exports = Contest;
