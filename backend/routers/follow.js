// importing & using router, controllers function, middlewares :-
const { Router } = require('express');

const router = Router();
const {
    addFollower, removeFollower,removeFollowing, getFollowingList, getFollowerList
} = require('../controllers/follow');
const {
    validateAuth, validateId, validateFollow,
} = require('../middlewares/validation');

// defining router :-
router.post('/followrequest/:name?', validateAuth, validateFollow, addFollower);
router.patch('/removefollower', validateAuth, removeFollower);
router.patch('/removefollowing', validateAuth, removeFollowing);
router.get('/getfollower', validateAuth, getFollowerList );
router.get('/getfollowing', validateAuth, getFollowingList )

// exporting the router :-
module.exports = router;