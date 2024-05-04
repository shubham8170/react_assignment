// importing AuthService, functions & packages :-
const bcrypt = require('bcrypt');
const AuthService = require('./services');
const { User } = require('../../models/index');
const { createItem, findItem, updateItem, findAllItems } = require('../../utils/dbMethods');
const { blackListToken } = require('../../middlewares/validation');
const {
    responseMessages, sendBadRequestResponse, sendServerErrorResponse, sendNotFoundResponse, sendForbiddenResponse, sendUnauthorizedResponse, sendSuccessResponse,
} = require('../../utils/response');

// users register by this function :-
const registerUser = async (req, res) => {
    try {
        const {
            firstname, lastname, username, avatar, email, password, gender, dob, city, country
        } = req.body;

        const isexistingUser = await findItem({ email: email.toLowerCase().trim() }, User);
        if (isexistingUser) return sendBadRequestResponse({ message: responseMessages.USER_ALREADY_EXISTS }, res, req);

        const salt = await bcrypt.genSalt(parseInt(10, 10));
        const encryptedPassword = await bcrypt.hash(password.toLowerCase().trim(), salt);

        const data = {
            firstname: firstname.trim(),
            lastname: lastname.trim(),
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: encryptedPassword,
            isActive: true,
            firstname, lastname, username, avatar, gender, dob, city, country
        };
        let createdUser = await createItem(data, User);
        createdUser = createdUser.toObject();
        delete data.password;
        data._id = createdUser._id;
        const createJwtToken = await AuthService.jwtTokenCreate(data);
        if (!createJwtToken) {
            return sendServerErrorResponse({ message: responseMessages.JWT_NOT_CREATED }, res, req);
        }
        data.access_token = createJwtToken;
        data.image = '';
        data.isOnBoardingCompleted = false;
        return sendSuccessResponse({ message: responseMessages.USER_CREATED_SUCCESSFUL, data }, res, req);
    } catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
};

// users login by this function :-
const loginUser = async (req, res) => {
    try {
        const { email, password, fcmtoken } = req.body;
        const existingUser = await findItem({ email: email.toLowerCase().trim() }, User);
        if (!existingUser) return sendNotFoundResponse({ message: responseMessages.USER_NOT_EXISTS }, res, req);

        if (!existingUser.isActive) return sendForbiddenResponse({ message: responseMessages.USER_NOT_ACTIVE }, res, req);

        const isValidPassword = await bcrypt.compareSync(password.toLowerCase().trim(), existingUser.password);
        if (!isValidPassword) return sendUnauthorizedResponse({ message: responseMessages.USER_WRONG_PASSWORD }, res, req);

        const createJwtToken = await AuthService.jwtTokenCreate(existingUser);
        if (!createJwtToken) {
            return sendServerErrorResponse({ message: responseMessages.JWT_NOT_CREATED }, res, req);
        }
        if (fcmtoken) {
            existingUser.fcmtoken = fcmtoken;
            await updateItem({ _id: existingUser._id }, existingUser, User);
        }

        const data = {
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            deviceType: existingUser.deviceType,
            isActive: existingUser.isActive,
            image: existingUser.image,
            isOnBoardingCompleted: existingUser.isOnBoardingCompleted,
            access_token: createJwtToken,
        };

        return sendSuccessResponse({ message: responseMessages.USER_LOGIN_SUCCESSFUL, data }, res, req);
    } catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
};

// getting user details by this function :-
const getUserDetails = async (req, res) => {
    try {
        let userId = req.params.id;
        if (userId === 'me') {
            userId = req.user._id;
        }
        let user = await findItem({ _id: userId }, User);
        if (!user) return sendNotFoundResponse({ message: responseMessages.USER_NOT_EXISTS }, res, req);
        user = user.toObject();
        delete user.password;
        return sendSuccessResponse({ message: responseMessages.USER_GETTING_SUCCESSFUL, data: user }, res, req);
    } catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
};

// user details update by this function :-
const updateUserDetails = async (req, res) => {
    try {
        let userId = req.params.id;
        if (userId === 'me') {
            userId = req.user._id;
        }
        let user = await findItem({ _id: userId }, User);
        if (!user) return sendNotFoundResponse({ message: responseMessages.USER_NOT_EXISTS }, res, req);

        const { firstName,lastName, avatar } = req.body;

        let updateData = {};
        if (firstName) {
            updateData.firstname = firstName.trim();
        }
        if (lastName) {
            updateData.lastname = lastName.trim();
        }
        if (avatar) {
            updateData.avatar = avatar.trim();
        }

        if (!firstName && !lastName && !avatar) {
            return sendBadRequestResponse({ message: responseMessages.NOTHING_TO_UPDATE }, res, req);
        }

        let updateUser = await updateItem({ _id: userId }, { $set: updateData }, User);
        updateUser = updateUser.toObject();
        delete updateUser.password;
        return sendSuccessResponse({ message: responseMessages.USER_UPDATE_SUCCESSFUL, data: updateUser }, res, req);
    } catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
};

// this function is for logout user :-
const userLogOut = async (req, res) => {
    try {
        const bearerHeader = req.headers.authorization;

        if (!bearerHeader) {
            return sendForbiddenResponse(responseMessages.TOKEN_AUTHENTICATION, res, req);
        }
        const token = bearerHeader.split(' ')[1].trim();
        blackListToken(token);
        return sendSuccessResponse({ message: responseMessages.USER_LOGOUT_SUCCESSFUL }, res, req);
    } catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
};

// this function will change the password :-
const changePassword = async (req, res) => {
    try {
        const {
            oldPassword, newPassword, confirmPassword, isValidated, email,
        } = req.body;

        let existingUser = await findItem({ email: email.toLowerCase().trim() }, User);
        if (!existingUser) return sendNotFoundResponse({ message: responseMessages.USER_NOT_EXISTS }, res, req);

        if (isValidated) {
            if (!oldPassword) {
                return sendBadRequestResponse({ message: responseMessages.OLD_PASSWORD_MANDATORY }, res, req);
            }
            const isValidPassword = await bcrypt.compareSync(oldPassword.toLowerCase().trim(), existingUser.password);
            if (!isValidPassword) return sendUnauthorizedResponse({ message: responseMessages.USER_WRONG_PASSWORD }, res, req);
        }

        if (newPassword.trim() !== confirmPassword.trim()) {
            return sendUnauthorizedResponse({ message: responseMessages.PASSWORD_NOT_MATCH }, res, req);
        }
        const salt = await bcrypt.genSalt(parseInt(10, 10));
        const encryptedPassword = await bcrypt.hash(newPassword.toLowerCase().trim(), salt);
        existingUser.password = encryptedPassword;
        await updateItem({ email: email.toLowerCase().trim() }, existingUser, User);
        return sendSuccessResponse({ message: responseMessages.USER_PASSWORD_SUCCESSFUL }, res, req);
    } catch (error) {
        console.log(error);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, error.message);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const data = await findAllItems({}, User);
        return sendSuccessResponse({ message: responseMessages.USER_GETTING_SUCCESSFUL, data }, res, req);
    }
    catch (error) {
        console.log(error);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, error.message);
    }
}

const searchUser = async (req, res) => {
    try {
        const { username } = req.body;
        console.log(username);
        const query = {
            $or: [
                { firstname: username },
                { lastname: username },
                { username },
            ],
            isActive: true,
            isSuspended: false,
        };

        const searchResults = await findAllItems(query, User);
        const uniqueUsers = new Set();
        searchResults.forEach((user) => {
            uniqueUsers.add(user._id.toString());
        });
        const uniqueUserArray = [...uniqueUsers];
        const finalSearchResults = await findAllItems({ _id: { $in: uniqueUserArray } }, User);
        const sanitizedResults = finalSearchResults.map((user) => {
            const { password, isActive, isSuspended, ...sanitizedUser } = user.toObject();
            return sanitizedUser;
        });

        return sendSuccessResponse({ message: responseMessages.USER_GETTING_SUCCESSFUL, search: sanitizedResults }, res, req);
    } catch (error) {
        console.error(error);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, error.message);
    }
};

const handleGoogleLogin = async (req, res) => {
    try {
        // console.log(req);
        console.log(req.user);
        const { sub, family_name, given_name, picture, email } = req.body;
        console.log(sub, family_name, given_name, picture, email);
        const existingUser = await findItem({ email: email }, User);
        if (existingUser) {
            const createJwtToken = await AuthService.jwtTokenCreate(existingUser);
            console.log('createJwtToken', createJwtToken);
            const userData = existingUser.toObject();
            userData.access_token = createJwtToken
            return sendSuccessResponse({ message: responseMessages.USER_LOGIN_SUCCESSFUL, data: userData }, res, req);
        }
        const data = {
            firstname: given_name,
            lastname: family_name,
            username: sub,
            avatar: picture,
            email: email,
            country: "India",
            city: "Delhi",
        };

        console.log(data);

        const userData = await createItem(data, User);

        let user = userData.toObject();
        delete user.password;

        const jwtToken = await AuthService.jwtTokenCreate(user);
        user.access_token = jwtToken;
        return sendSuccessResponse({ message: responseMessages.REGISTER_SUCCESSFUL, data: user }, res, req);
    }
    catch (err) {
        console.error(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
}

const updateUsername = async(req,res)=>{
    try{
        const {username} = req.body;
        const isUsernamePresent = await findItem({username}, User);
        if(isUsernamePresent){
            return sendBadRequestResponse({ message: responseMessages.USERNAME_NOT_AVAILABLE }, res, req);
        }
        const userData = await findItem({_id:req.user._id},User);
        let user = userData.toObject();
        user.username = username;
        await updateItem({_id:req.user._id}, user, User);
        return sendSuccessResponse({ message: responseMessages.USERNAME_UPDATED_SUCCESSFULLY, data: user }, res, req);
    }
    catch (err) {
        console.error(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
}


// exporting the functions :-
module.exports = {
    registerUser, loginUser, getUserDetails, updateUserDetails, userLogOut, changePassword, getAllUsers,
    searchUser, handleGoogleLogin, updateUsername
};