const {
    responseMessages, sendBadRequestResponse, sendServerErrorResponse, sendNotFoundResponse, sendForbiddenResponse, sendUnauthorizedResponse, sendSuccessResponse,
} = require('../../utils/response');
const { createItem, findItem, updateItem, findAllItemsDesc, deleteItem } = require('../../utils/dbMethods');

const FollowService = require('./services')
const { Follow, User } = require('../../models/index')

// this function will use to add follower
const addFollower = async (req, res) => {
    try {
        let { followerId, followingId, followerName } = req.body;
        const name = req.params.name;
        if (req.user != followerId || name == 'me') {
            followerId = req.user._id.toString()
        }
        const isfollowerPresent = await findItem({ _id: followerId }, User);
        const isfollowingPresent = await findItem({ _id: followingId }, User);

        if (!FollowService.validateUserId(followerId) || !FollowService.validateUserId(followerId) || !isfollowerPresent || !isfollowingPresent) {
            return sendBadRequestResponse({ message: responseMessages.INVALID_USERID }, res, req);
        }
        //checking already following or not 
        const isAlreadyFollowing = await findItem({ followerId, followingId }, Follow)
        if (isAlreadyFollowing) {
            await deleteItem({ followerId, followingId }, Follow)
            return sendSuccessResponse({ message: responseMessages.FOLLOWER_REMOVE_SUCCESSFUL }, res, req);
        }
        const followingusername = isfollowingPresent?.username;
        const followingname = isfollowingPresent?.firstname + isfollowingPresent?.lastname;
        const followerusername = isfollowerPresent?.username;
        const followername = isfollowerPresent?.firstname + isfollowerPresent?.lastname;
        const data = { followerId, followingId, followerName, followingusername, followingname, followerusername, followername };
        await createItem(data, Follow);
        return sendSuccessResponse({ message: responseMessages.FOLLOWER_ADD_SUCCESSFUL, data }, res, req);
    }
    catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
}

const removeFollower = async (req, res) => {
    try {
        const { followerId, followingId } = req.query;
        if (followerId != req.user._id) {
            return sendBadRequestResponse({ message: responseMessages.UNAUTHARIZED_ACCESS }, res, req);
        }
        const isfollowerPresent = await findItem({ _id: followerId }, User);
        const isfollowingPresent = await findItem({ _id: followingId }, User);
        const isAlreadyFollowing = await findItem({ followerId, followingId }, Follow)
        if (!isAlreadyFollowing || !isfollowerPresent || !isfollowingPresent) {
            return sendBadRequestResponse({ message: responseMessages.NOT_FOLLOWING }, res, req);
        }
        let followData = isAlreadyFollowing.toObject();
        followData.isActive = false;
        await updateItem(followData._id, followData, Follow);
        return sendSuccessResponse({ message: responseMessages.FOLLOWER_REMOVE_SUCCESSFUL, followData }, res, req);

    }
    catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
}

const removeFollowing = async (req, res) => {
    try {
        const { followerId, followingId } = req.query;
        if (followingId != req.user._id) {
            return sendBadRequestResponse({ message: responseMessages.UNAUTHARIZED_ACCESS }, res, req);
        }
        const isfollowerPresent = await findItem({ _id: followerId }, User);
        const isfollowingPresent = await findItem({ _id: followingId }, User);
        const isAlreadyFollowing = await findItem({ followerId, followingId }, Follow)
        if (!isAlreadyFollowing || !isfollowerPresent || !isfollowingPresent) {
            return sendBadRequestResponse({ message: responseMessages.NOT_FOLLOWING }, res, req);
        }
        let followData = isAlreadyFollowing.toObject();
        followData.isActive = false;
        await updateItem(followData._id, followData, Follow);
        return sendSuccessResponse({ message: responseMessages.FOLLOWER_REMOVE_SUCCESSFUL, followData }, res, req);

    }
    catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
}

const getFollowerList = async(req,res)=>{
    try{
        const userId = req.user._id;
        const followerList = await findAllItemsDesc({followingId: userId}, Follow);
        return sendSuccessResponse({ message: responseMessages.FOLLOWER_REMOVE_SUCCESSFUL, data: followerList }, res, req);
    }
    catch(err){
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
}

const getFollowingList = async(req,res)=>{
    try{
        const userId = req.user._id;
        const followerList = await findAllItemsDesc({followerId: userId}, Follow);
        return sendSuccessResponse({ message: responseMessages.FOLLOWER_REMOVE_SUCCESSFUL, data: followerList }, res, req);
    }
    catch(err){
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
}


module.exports = { addFollower, removeFollower, removeFollowing, getFollowerList, getFollowingList }