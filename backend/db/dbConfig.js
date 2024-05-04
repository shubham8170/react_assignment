// importing mongoose & defining config :-
require('dotenv').config();
const mongoose = require('mongoose');
const { contestScheduler } = require('../controllers/contest/scheduler')


const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/twinphy';
// const DB_URL = 'mongodb+srv://root:root032145@twinphy.xdtbb2i.mongodb.net/Twinphy'
// DB connection :-
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to the MongoDb..');
        contestScheduler();
    })
    .catch((err) => console.error('Could Not Connect to the MongoDb..'));

// exporting mongoose :-
module.exports = mongoose;
