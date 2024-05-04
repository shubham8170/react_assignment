const {
    responseMessages, sendBadRequestResponse, sendServerErrorResponse, sendNotFoundResponse, sendForbiddenResponse, sendUnauthorizedResponse, sendSuccessResponse,
} = require('../../utils/response');
const { createItem, findItem, updateItem, findAllItemsDesc, deleteItem } = require('../../utils/dbMethods');
const mongoose = require('mongoose');

const stripe = require('stripe')(process.env.STRIPE_SECT_KEY);

const { Contest, User, ContestParticipation } = require('../../models/index');

const createContest = async (req, res) => {
    try {
        console.log(req.body);
        const { contestName, contestDescription, expireAt, contestTotalround, contestSteps } = req.body;
        const createdBy = req.admin._id;
        const isExistingContest = await findItem({ createdBy, contestName, isExpired: false, isDeleted: false }, Contest);
        if (isExistingContest) {
            return sendBadRequestResponse({ message: responseMessages.SAMENAME_CONTEST }, res, req);
        }

        contestSteps.forEach(obj => {
            console.log(obj); // Log the entire object
            console.log(obj.likes); // Access a property of the object
            console.log(obj.key2); // Access another property of the object
          });
          

        const contest = {
            contestName,
            contestDescription,
            expireAt,
            contestSteps, // Use the array directly
            contestTotalround,
            createdBy,
        };
        console.log(contest);

        const createdContestData = await createItem(contest, Contest);
        return sendSuccessResponse({ message: responseMessages.CONTEST_CREATED_SUCCESSFULLY, data: createdContestData }, res, req);
    } catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
};

const deleteContest = async (req, res) => {
    try {
        const contestId = req.params.id;
        const adminId = req.admin._id;
        const contestData = await findItem({ _id: contestId, createdBy: adminId, isDeleted: false, isExpired: false }, Contest);
        if (!contestData) {
            return sendNotFoundResponse({ message: responseMessages.CONTEST_NOT_FOUND }, res, req);
        }
        let updatedContest = contestData.toObject();
        updatedContest.isDeleted = true;
        await updateItem({ _id: contestId }, updatedContest, Contest);
        return sendSuccessResponse({ message: responseMessages.CONTEST_DELETED_SUCCESSFULLY }, res, req);
    }
    catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
}

const contestEnrollment = async (req, res) => {
    try {
        const userId = req.user._id;
        const contestId = req.params.id;
        const isValiduser = await findItem({ _id: userId, isSuspended: false, isActive: true }, User);
        const isValidContest = await findItem({ _id: contestId, isDeleted: false, isExpired: false }, Contest);
        if (!isValiduser) {
            return sendNotFoundResponse({ message: responseMessages.USER_NOT_EXISTS }, res, req);
        }
        if (!isValidContest) {
            return sendNotFoundResponse({ message: responseMessages.CONTEST_NOT_FOUND }, res, req);
        }
        const isAlreadyParticipate = await findItem({ contestId, userId }, ContestParticipation)
        if (isAlreadyParticipate) {
            return sendSuccessResponse({ message: responseMessages.ALREADY_ENROLLED }, res, req);
        }
        const data = {
            contestId,
            userId,
            userName: isValiduser?.firstname + isValiduser?.lastname
        }
        await createItem(data, ContestParticipation);
        return sendNotFoundResponse({ message: responseMessages.ENROLLMENT_SUCCESSFUL }, res, req);
    }
    catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
}

const getContest = async(req,res)=>{
    try{
        const adminId = '6519ac97aae23767acaa5123' || req.admin._id;       
        const contestData = await findAllItemsDesc({isDeleted: false, isActive:true, createdBy:adminId}, Contest);
        return sendSuccessResponse({ message: responseMessages.CONTEST_DATA, data: contestData }, res, req,);

    }
    catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
}

const getExpiredContest = async(req,res)=>{
    try{
        const adminId = '6519ac97aae23767acaa5123' || req.admin._id;       
        const contestData = await findAllItemsDesc({isExpired: true, createdBy:adminId}, Contest);
        return sendSuccessResponse({ message: responseMessages.CONTEST_DATA, data: contestData }, res, req,);

    }
    catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
}

const getContestList = async(req,res)=>{
    try{
        const contestData = await findAllItemsDesc({isDeleted: false, isActive:true, isExpired:false}, Contest);
        return sendSuccessResponse({ message: responseMessages.CONTEST_DATA, data: contestData }, res, req,);
    }
    catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
}

const makePayment = async (req, res) => {
    try {    
        console.log("Hitted =========");
        const { product } = req.body;
        console.log("product", product);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', ], // Valid payment method types
            line_items: [{
                price_data: {
                    currency: product.currency,
                    product_data: {
                        name: product.product_data.name,
                    },
                    unit_amount: product.unit * 100, // Amount should be in smallest currency unit (cents for INR)
                },
                quantity: 1, // You can adjust quantity as needed
            }],
            mode: "payment",
            success_url: "http://localhost:3000/success",
            // cancel_url: "http://localhost:3000/cancel",
            // error_url: "http://localhost:3000/failed",
        });

        console.log("session", session);
        return sendSuccessResponse({ message: responseMessages.CONTEST_DATA, id: session.id }, res, req);
    }
    catch(err) {
        console.log(err);
    }
};


module.exports = { createContest, deleteContest, contestEnrollment, getContest, getExpiredContest, getContestList, makePayment }