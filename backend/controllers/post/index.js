const aws = require('aws-sdk');
const path = require('path');
const fs = require('fs');

const {
    responseMessages, sendBadRequestResponse, sendServerErrorResponse, sendNotFoundResponse, sendForbiddenResponse, sendUnauthorizedResponse, sendSuccessResponse,
} = require('../../utils/response');
const { createItem, findItem, updateItem, findAllItems, findAllItemsDesc } = require('../../utils/dbMethods');
const { awsUpload } = require('../../middlewares/uploadFile');
const { Posts, User, Contest, ContestParticipation } = require('../../models/index');
const { query } = require('express');
const { post } = require('../../routers/post');


const addPost = async (req, res) => {
    try {
        console.log(req.body)
        const { text, contestId } = req.body;
        const file = req.file
        const userId = req.params.id;
        const postData = {
            userId,
        }
        if (contestId) {
            const idPattern = /^[0-9a-fA-F]{24}$/;
            if (idPattern.test(contestId)) {
                // return sendBadRequestResponse({ message: responseMessages.INVALID_CONTEST_ID }, res, req);
                const isValidContest = await findItem({ _id: contestId, isDeleted: false, isExpired: false, isActive: true }, Contest);
                if (!isValidContest) {
                    return sendBadRequestResponse({ message: responseMessages.CONTEST_NOT_FOUND }, res, req);
                }
                // isUserEnroll = await findItem({ userId: userId, contestId }, ContestParticipation);
                // if (!isUserEnroll) {
                //     return sendBadRequestResponse({ message: responseMessages.NOT_ENROLLED }, res, req);
                // }
                postData.contestId = contestId;
            }
            
        }
        if (req.user._id != userId) {
            return sendBadRequestResponse({ message: responseMessages.UNAUTHARIZED_ACCESS }, res, req);
        }
        if (!file && !text) {
            return sendBadRequestResponse({ message: responseMessages.INVALID_POST }, res, req);
        }
        if (file) {
            const fileKey = `uploads/${Date.now()}${path.extname(file.originalname)}`;
            const link = await awsUpload(file, fileKey);
            postData.file = link;
        }
        if (text) {
            postData.text = text;
        }
        const uploadedPostData = await createItem(postData, Posts);
        return sendSuccessResponse({ message: responseMessages.POST_UPLOADED_SUCCESSFUL, uploadedPostData }, res, req);

    }
    catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
}

const deletePost = async (req, res) => {
    try {
        const { userId, postId } = req.body;
        if (userId != req.user._id) {
            return sendBadRequestResponse({ message: responseMessages.UNAUTHARIZED_ACCESS }, res, req);
        }
        const query = { _id: postId, userId: userId, isDeleted: false }
        const postData = await findItem(query, Posts);
        if (!postData) {
            return sendBadRequestResponse({ message: responseMessages.INVALID_POST }, res, req);
        }
        const post = postData.toObject();
        post.isDeleted = true;
        console.log(post);
        await updateItem(query, post, Posts);
        return sendSuccessResponse({ message: responseMessages.POST_DELETED_SUCCESSFUL, post }, res, req);
    }
    catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
}

const editPost = async (req, res) => {
    try {
        const { text, postId, userId } = req.body;
        if (!text) {
            return sendBadRequestResponse({ message: responseMessages.INVALID_REQUEST }, res, req);
        }
        const query = { _id: postId, userId, isDeleted: false };
        const postData = await findItem(query, Posts);
        if (!postData) {
            return sendBadRequestResponse({ message: responseMessages.INVALID_POST }, res, req);
        }
        const post = postData.toObject();
        post.text = text;
        await updateItem(query, post, Posts);
        return sendSuccessResponse({ message: responseMessages.POST_EDITED_SUCCESSFUL, post }, res, req);
    }
    catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
}

const likePost = async (req, res) => {
    try {
        const { userId, postId } = req.body;
        const userData = await findItem({ _id: userId }, User);
        console.log('userData ', userData);
        console.log(req.user._id);
        if (!userData || req.user._id != userId) {
            return sendBadRequestResponse({ message: responseMessages.UNAUTHARIZED_ACCESS }, res, req);
        }
        const postData = await findItem({ _id: postId }, Posts);
        if (!postData) {
            return sendBadRequestResponse({ message: responseMessages.INVALID_POST }, res, req);
        }
        const post = postData.toObject();
        const doesUserLikePost = post.likes.some(like => like.userId === userId);
        const user = userData.toObject()
        const likesData = {
            userId,
            userName: user?.firstname + user?.lastname
        };
        if (doesUserLikePost) {
            const likes = post.likes.filter(item => item.userId !== userId);
            console.log(likes);
            post.likes = likes;
        } else {
            post.likes.push(likesData);
        }

        await updateItem({ _id: postId }, post, Posts);
        return sendSuccessResponse({ message: responseMessages.POST_LIKED_SUCCESSFUL, post }, res, req);
    }
    catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
}

const commentPost = async (req, res) => {
    try {
        const { postId, comment } = req.body;
        const userId = req.user._id;
        const userData = await findItem({ _id: req.user._id }, User);
        console.log('userData ', userData);
        console.log(req.user._id);
        if (!userData) {
            return sendBadRequestResponse({ message: responseMessages.UNAUTHARIZED_ACCESS }, res, req);
        }
        const postData = await findItem({ _id: postId }, Posts);
        if (!postData) {
            return sendBadRequestResponse({ message: responseMessages.INVALID_POST }, res, req);
        }
        const post = postData.toObject();
        const user = userData.toObject()
        const commentData = {
            userId,
            userName: user?.firstname + user?.lastname,
            comment
        };
            post.comments.push(commentData);
        

        await updateItem({ _id: postId }, post, Posts);
        return sendSuccessResponse({ message: responseMessages.POST_COMMENT_SUCCESSFUL, post }, res, req);
    }
    catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
}

const getAllPosts = async (req, res) => {
    try {
        const postData = await findAllItemsDesc({ isDeleted: false }, Posts);
        return sendSuccessResponse({ message: responseMessages.POST_EDITED_SUCCESSFUL, data: postData }, res, req);
    }
    catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
}

const getUserAllPosts = async (req, res) => {
    try {
        const userId = '650b0d5c23e6429f18420af1' || req.params.id;
        const postData = await findAllItemsDesc({ userId, isDeleted: false }, Posts);
        return sendSuccessResponse({ message: responseMessages.POST_EDITED_SUCCESSFUL, data: postData }, res, req);
    }
    catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
}

const getPostDetails = async (req, res) => {
    try {
        const postId = req.params.id;
        const postData = await findItem({ _id: postId, isDeleted: false }, Posts);
        return sendSuccessResponse({ message: responseMessages.POST_DETAILS, data: postData }, res, req);
    }
    catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
}

module.exports = { addPost, deletePost, editPost, likePost, getAllPosts, getUserAllPosts, commentPost, getPostDetails }