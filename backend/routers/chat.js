// importing & using router, controllers function, middlewares :-
const { Router } = require('express');

const router = Router();
const {
    getChatUser, getChat
} = require('../controllers/chat');
const {
    validateRegisterUser, validateLoginUser, validateAuth, validateUserUpdate, validateId, validateChangePassword, validateOtpInfo, validateFcmToken, validateForgotPassword,
} = require('../middlewares/validation');

// defining router :-
router.get('/chats/', getChat);
router.get('/chatlist/:userid', getChatUser);

// exporting the router :-
module.exports = router;