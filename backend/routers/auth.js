// importing & using router, controllers function, middlewares :-
const { Router } = require('express');

const router = Router();
const {
    registerUser, loginUser, getUserDetails, updateUserDetails, userLogOut, changePassword, storeFcm, forgotPassword, validateOtp, getAllUsers, 
    searchUser, handleGoogleLogin, updateUsername
} = require('../controllers/auth');
const {
    validateRegisterUser, validateLoginUser, validateAuth, validateUserUpdate, validateId, validateChangePassword, validateOtpInfo, validateFcmToken, validateForgotPassword,
} = require('../middlewares/validation');

// defining router :-
router.post('/register', validateRegisterUser, registerUser);
router.post('/login', validateLoginUser, loginUser);
router.patch('/changepassword', validateChangePassword, changePassword);
router.post('/logout', validateAuth, userLogOut);
router.get('/users', validateAuth, getAllUsers);
router.get('/:id', getUserDetails);
router.patch('/changeusername', validateAuth, updateUsername)
router.patch('/:id', validateAuth, validateId, validateUserUpdate, updateUserDetails);
router.post('/search', searchUser);
router.post('/login/google', handleGoogleLogin);

// exporting the router :-
module.exports = router;