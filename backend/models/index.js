const User = require('./auth');
const Follow = require('./follow');
const Posts = require('./posts');
const Chat = require('./chat');
const Admin = require('./admin');
const Contest = require('./contest');
const ContestParticipation = require('./contestparticipation');
const ContestDisqualifiedUsers = require('./contestdisquilified')


// exporting models :-
module.exports = {
    User, Follow, Posts, Chat, Admin, Contest, ContestParticipation, ContestDisqualifiedUsers
};