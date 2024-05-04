require('dotenv').config();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const tokenBlacklist = new Set();

const config = process.env;
const {
    sendUnprocessableResponse, sendUnauthorizedResponse, sendForbiddenResponse, sendBadRequestResponse, responseMessages,
} = require('../utils/response');
const { findItem } = require('../utils/dbMethods');
const { User, Admin } = require('../models/index');

const validateRegisterUser = [
    check('firstname')
        .exists()
        .withMessage('Name is Missing')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name Must Be Between 2 and 50 Characters Long')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Name is Empty'),
    check('lastname')
        .exists()
        .withMessage('Last Name is Missing')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last Name Must Be Between 2 and 50 Characters Long')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Last Name is Empty'),
    check('username')
        .exists()
        .withMessage('User name is Missing')
        .isLength({ min: 2, max: 50 })
        .withMessage('username Must Be Between 2 and 50 Characters Long')
        .trim()
        .not()
        .isEmpty()
        .withMessage('User Name is Empty'),
    check('gender')
        .exists()
        .withMessage('Gender is Missing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Gender is Empty'),
    check('dob')
        .exists()
        .withMessage('Date of birthis Missing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('DOB is Empty'),
    check('city')
        .exists()
        .withMessage('city Name is Missing')
        .isLength({ min: 2, max: 50 })
        .withMessage('City Must Be Between 2 and 50 Characters Long')
        .trim()
        .not()
        .isEmpty()
        .withMessage('City is Empty'),
    check('country')
        .exists()
        .withMessage('Country Name is Missing')
        .isLength({ min: 2, max: 50 })
        .withMessage('Country Name Must Be Between 2 and 50 Characters Long')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Country Name is Empty'),
    check('email')
        .exists()
        .withMessage('Email is Missing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Email is Empty')
        .isEmail()
        .withMessage('Invalid Email Address'),
    check('password')
        .exists()
        .withMessage('Password is Missing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Password is Empty')
        .isLength({ min: 8, max: 50 })
        .withMessage('Password must be between 8 and 50 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendUnprocessableResponse({ message: responseMessages.UNPROCESSABLE_RESPONSE, errors: errors.array() }, res, req);
        }
        return next();
    },
];

const validateLoginUser = [
    check('email')
        .exists()
        .withMessage('Email is Missing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Email is Empty')
        .isEmail()
        .withMessage('Invalid Email Address'),
    check('password')
        .exists()
        .withMessage('Password is Missing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Password is Empty')
        .isLength({ min: 8, max: 50 })
        .withMessage('Password must be between 8 and 50 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendUnprocessableResponse({ message: responseMessages.UNPROCESSABLE_RESPONSE, errors: errors.array() }, res, req);
        }
        return next();
    },
];


const blackListToken = (token) => {
    tokenBlacklist.add(token);
};

const validateAuth = async (req, res, next) => {
    const bearerHeader = req.headers.authorization;

    if (!bearerHeader) {
        return sendForbiddenResponse(responseMessages.TOKEN_AUTHENTICATION, res, req);
    }
    const token = bearerHeader.split(' ')[1].trim();
    try {
        const decoded = jwt.verify(token, config.JWT_TOKEN_KEY);
        let user = await findItem({ _id: decoded._id }, User);
        if (user && user.isActive && !tokenBlacklist.has(token)) {
            user = user.toObject();
            delete user.forgotOtpInfo;
            req.user = user;
            return next();
        }
        return sendUnauthorizedResponse(responseMessages.TOKEN_INVALID, res, req);
    } catch (err) {
        return sendUnauthorizedResponse(responseMessages.TOKEN_INVALID, res, req);
    }
};

const validateAdmin = async (req, res, next) => {
    const bearerHeader = req.headers.authorization;
    if (!bearerHeader) {
        return sendForbiddenResponse(responseMessages.TOKEN_AUTHENTICATION, res, req);
    }
    const token = bearerHeader.split(' ')[1].trim();
    try {
        const decoded = jwt.verify(token, config.JWT_TOKEN_KEY);
        let admin = await findItem({ _id: decoded._id }, Admin);
        if (admin && admin.isActive && !tokenBlacklist.has(token)) {
            req.admin = admin;
            return next();
        }
        return sendUnauthorizedResponse(responseMessages.TOKEN_INVALID, res, req);
    } catch (err) {
        return sendUnauthorizedResponse(responseMessages.TOKEN_INVALID, res, req);
    }
};

const validateUserAdmin = async (req, res, next) => {
    const bearerHeader = req.headers.authorization;

    if (!bearerHeader) {
        return sendForbiddenResponse(responseMessages.TOKEN_AUTHENTICATION, res, req);
    }
    const token = bearerHeader.split(' ')[1].trim();
    try {
        const decoded = jwt.verify(token, config.JWT_TOKEN_KEY);
        let admin = await findItem({ _id: decoded._id }, Admin);
        if (admin && admin.isActive && !tokenBlacklist.has(token)) {
            req.admin = admin;
            return next();
        }
        let user = await findItem({ _id: decoded._id }, User);
        if (user && user.isActive && !tokenBlacklist.has(token)) {
            req.user = user;
            return next();
        }
        return sendUnauthorizedResponse(responseMessages.TOKEN_INVALID, res, req);
    } catch (err) {
        return sendUnauthorizedResponse(responseMessages.TOKEN_INVALID, res, req);
    }
};

const validateChangePassword = [
    check('isValidated')
        .isBoolean()
        .notEmpty()
        .withMessage('isValidated field is Mandatory and must be a Boolean'),
    check('email')
        .exists()
        .withMessage('Email is Missing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Email is Empty')
        .isEmail()
        .withMessage('Invalid Email Address'),
    check('oldPassword')
        .optional()
        .trim()
        .not()
        .isEmpty()
        .withMessage('Password is empty')
        .isLength({ min: 8, max: 50 })
        .withMessage('Password must be between 8 and 50 characters long'),
    check('newPassword')
        .exists().withMessage('New Password is missing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('New Password is empty')
        .isLength({ min: 8, max: 50 })
        .withMessage('Password must be between 8 and 50 characters long'),
    check('confirmPassword')
        .exists().withMessage('Confirm Password is missing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Confirm Password is empty')
        .isLength({ min: 8, max: 50 })
        .withMessage('Password must be between 8 and 50 characters long'),
    check('confirmpassword').custom((value, { req }) => {
        if (value !== req.body.newpassword) {
            throw new Error(responseMessages.PASSWORD_NOT_MATCH);
        }
        return true;
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendUnprocessableResponse({ message: responseMessages.UNPROCESSABLE_RESPONSE, errors: errors.array() }, res, req);
        }
        return next();
    },
];

const validateUserUpdate = [
    check('firstname')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters long')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Name is required'),
    check('lastname')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters long')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Name is required'),
    check('avatar')
        .optional({ nullable: true })
        .isString()
        .withMessage('Aquarium image must be a valid URL'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendUnprocessableResponse({ message: responseMessages.UNPROCESSABLE_RESPONSE, errors: errors.array() }, res, req);
        }
        return next();
    },
];

const validateId = async (req, res, next) => {
    try {
        const idPattern = /^[0-9a-fA-F]{24}$/;
        const { id } = req.params;
        if (id === 'me') {
            return next();
        }
        if (!id || !idPattern.test(id)) {
            throw new Error(responseMessages.INVALID_ID);
        }
        return next();
    } catch (error) {
        console.log(error);
        return sendBadRequestResponse({ error: error.message }, res, req);
    }
};

const validateMongoId = async (req, res, next) => {
    try {
        const idPattern = /^[0-9a-fA-F]{24}$/;
        const { id } = req.params;
        if (!id || !idPattern.test(id)) {
            throw new Error(responseMessages.INVALID_ID);
        }
        return next();
    } catch (error) {
        console.log(error);
        return sendBadRequestResponse({ error: error.message }, res, req);
    }
};


const validateForgotPassword = [
    check('email')
        .exists()
        .withMessage('Email is Missing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Email is Empty')
        .isEmail()
        .withMessage('Invalid Email Address'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendUnprocessableResponse({ message: responseMessages.UNPROCESSABLE_RESPONSE, errors: errors.array() }, res, req);
        }
        return next();
    },
];

const validateFollow = [
    check('followerId')
        .exists()
        .withMessage('followerId is Missing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('EmaifollowerIdl is Empty'),
    check('followingId')
        .exists()
        .withMessage('followingId is Missing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('followingId is Empty'),
    check('followerName')
        .exists()
        .withMessage('followerName is Missing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('followerName is Empty'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendUnprocessableResponse({ message: responseMessages.UNPROCESSABLE_RESPONSE, errors: errors.array() }, res, req);
        }
        return next();
    },
];

const validateAdminRegistration = [
    check('name')
        .exists()
        .withMessage('Name is Missing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Name is Empty'),
    check('email')
        .exists()
        .withMessage('Email is Missing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Email is Empty'),
    check('password')
        .exists()
        .withMessage('Password is Missing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Password is Empty'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendUnprocessableResponse({ message: responseMessages.UNPROCESSABLE_RESPONSE, errors: errors.array() }, res, req);
        }
        return next();
    },
];

const validateContestCreation = [
    check('contestName')
        .exists()
        .withMessage('Contest Name is Missing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Contest Name is Empty'),
    check('contestSteps')
        .exists()
        .withMessage('contestSteps is Missing')
        .not()
        .isEmpty()
        .withMessage('contestSteps is Empty'),

    check('contestDescription')
        .exists()
        .withMessage('contestDescription is Missing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('contestDescription is Empty')
        .isLength({ min: 30 })
        .withMessage('contestDescription should be at least 30 characters'),

    check('expireAt')
        .exists()
        .withMessage('expireAt is Missing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('expireAt is Empty')
        .custom((value, { req }) => {
            const currentDate = new Date();
            if (new Date(value) <= currentDate) {
                throw new Error('expireAt should be greater than today');
            }
            return true;
        }),

    check('contestTotalround')
        .exists()
        .withMessage('contestTotalround is Missing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('contestTotalround is Empty')
        .isNumeric()
        .withMessage('contestTotalround should be a number'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendUnprocessableResponse({ message: responseMessages.UNPROCESSABLE_RESPONSE, errors: errors.array() }, res, req);
        }
        return next();
    },
];

// exporting the validation here :-
module.exports = {
    validateRegisterUser,
    validateLoginUser,
    validateAuth,
    validateUserUpdate,
    validateId,
    blackListToken,
    validateChangePassword,
    validateAdmin,
    validateForgotPassword,
    validateUserAdmin,
    validateFollow,
    validateAdminRegistration,
    validateContestCreation,
    validateMongoId
};