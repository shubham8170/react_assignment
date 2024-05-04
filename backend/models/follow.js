// importing mongoose :-
const mongoose = require('mongoose');

// defining schema :-
const followSchema = new mongoose.Schema({
    followerId:{
        type:String,
        required:true
    },
    followingId:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
    followerName:{
        type:String,
        // required:true
    },
    followingusername:{
        type:String,
    },
    followingname:{
        type:String,
    },
    followerusername:{
        type:String,
    },
    followername:{
        type:String,
    }
   
}, { timestamps: true });

// renaming the collection :-
const Follow = mongoose.model('Follow', followSchema, 'Follow');

// exporting the User :-
module.exports = Follow;
