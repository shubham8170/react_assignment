// importing AuthService, functions & packages :-
const bcrypt = require('bcrypt');
const AuthService = require('../auth/services');
const {
    Admin, User, Aquarium, Logs,
} = require('../../models/index');
const {
    createItem, findItem, findAllItems, countAllItems, findAllItemsDesc, deleteItem, updateItem,
} = require('../../utils/dbMethods');
const { blackListToken, validateId } = require('../../middlewares/validation');
const {
    responseMessages, sendBadRequestResponse, sendServerErrorResponse, sendNotFoundResponse, sendForbiddenResponse, sendUnauthorizedResponse, sendSuccessResponse, sendSuccessResponseGetLogs, sendServerErrorResponseGetLogs,
} = require('../../utils/response');

// admins register by this function :-
const registerAdmin = async (req, res) => {
    try {
        const {
            name, email, password, deviceType,
        } = req.body;

        const isexistingAdmin = await findItem({ email: email.toLowerCase().trim() }, Admin);
        if (isexistingAdmin) return sendBadRequestResponse({ message: responseMessages.ADMIN_ALREADY_EXISTS }, res);

        const salt = await bcrypt.genSalt(parseInt(10, 10));
        const encryptedPassword = await bcrypt.hash(password.trim(), salt);

        const data = {
            name: name.toLowerCase().trim(),
            email: email.toLowerCase().trim(),
            password: encryptedPassword,
            isActive: true,
        };
        let createdAdmin = await createItem(data, Admin);
        createdAdmin = createdAdmin.toObject();
        delete data.password;
        data._id = createdAdmin._id;
        const createJwtToken = await AuthService.jwtTokenCreate(data);
        if (!createJwtToken) {
            return sendServerErrorResponse({ message: responseMessages.JWT_NOT_CREATED }, res, req);
        }
        data.access_token = createJwtToken;
        data.image = '';
        data.isOnBoardingCompleted = false;
        return sendSuccessResponse({ message: responseMessages.ADMIN_CREATED_SUCCESSFUL, data }, res, req);
    } catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
};

// admin login by this function :-
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingAdmin = await findItem({ email: email.toLowerCase().trim() }, Admin);
        if (!existingAdmin) return sendNotFoundResponse({ message: responseMessages.ADMIN_NOT_EXISTS }, res, req);

        if (!existingAdmin.isActive) return sendForbiddenResponse({ message: responseMessages.ADMIN_NOT_ACTIVE }, res, req);

        const isValidPassword = await bcrypt.compareSync(password.trim(), existingAdmin.password);
        if (!isValidPassword) return sendUnauthorizedResponse({ message: responseMessages.USER_WRONG_PASSWORD }, res, req);

        const createJwtToken = await AuthService.jwtTokenCreate(existingAdmin);
        if (!createJwtToken) {
            return sendServerErrorResponse({ message: responseMessages.JWT_NOT_CREATED }, res, req);
        }

        const data = {
            _id: existingAdmin._id,
            name: existingAdmin.name,
            email: existingAdmin.email,
            deviceType: existingAdmin.deviceType,
            isActive: existingAdmin.isActive,
            image: existingAdmin.image,
            isOnBoardingCompleted: existingAdmin.isOnBoardingCompleted,
            access_token: createJwtToken,
        };

        return sendSuccessResponse({ message: responseMessages.existingAdmin, data }, res, req);
    } catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
};

// getting admin details by this function :-
const getAdminDetails = async (req, res) => {
    try {
        let adminId = req.params.id;
        if (adminId === 'me') {
            adminId = req.admin._id;
        }
        let admin = await findItem({ _id: adminId }, Admin);
        if (!admin) return sendNotFoundResponse({ message: responseMessages.ADMIN_NOT_EXISTS }, res, req);
        admin = admin.toObject();
        delete admin.password;
        return sendSuccessResponse({ message: responseMessages.ADMIN_GETTING_SUCCESSFUL, data: admin }, res, req);
    } catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
};

// this function is for logout admin :-
const AdminLogOut = async (req, res) => {
    try {
        const bearerHeader = req.headers.authorization;

        if (!bearerHeader) {
            return sendForbiddenResponse(responseMessages.TOKEN_AUTHENTICATION, res, req);
        }
        const token = bearerHeader.split(' ')[1].trim();
        blackListToken(token);
        return sendSuccessResponse({ message: responseMessages.ADMIN_LOGOUT_SUCCESSFUL }, res, req);
    } catch (err) {
        console.log(err);
        return sendServerErrorResponse({ message: responseMessages.INTERNAL_SERVER_ERROR }, res, req, err.message);
    }
};

// this function return all the userdetails along with aquariumData :-
const getUserDetails = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 0;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = page * limit;

        const usersData = await findAllItemsDesc(
            { isSuspended: false, isActive: true },
            User,
            offset,
            limit,
        );

        const result = await Promise.all(
            usersData.map(async (user) => {
                const userData = user.toObject();
                const data = {
                    _id: userData._id,
                    name: userData?.firstname,
                    email: userData.email,
                    image: userData?.avatar,
                    isOnBoardingCompleted: userData.isOnBoardingCompleted,
                    createdAt: userData.createdAt,
                };
                console.log(data);
                return data;
            }),
        );

        const userCount = await countAllItems(
            { isDeleted: false, isActive: true },
            User,
        );
        const totalPages = Math.ceil(userCount / limit);

        return sendSuccessResponse({
            message: responseMessages.ACTIVE_USER_DETAILS,
            data: result,
            count: userCount,
            pages: totalPages,
        }, res, req);
    } catch (err) {
        console.error(err);
        return sendServerErrorResponse(
            { message: responseMessages.INTERNAL_SERVER_ERROR },
            res,
            req,
            err.message,
        );
    }
};

const suspendUser = async(req,res)=>{
  try{
    const userId = req.params.id;
    const userData = await findItem({_id:userId}, User);
    if(!userData){
        return sendBadRequestResponse({
            message: responseMessages.USER_NOT_EXISTS,
        }, res, req); 
    }
    const user = userData.toObject();
    user.isSuspended = true;
    await updateItem({_id:userId}, user, User);
    return sendSuccessResponse({
        message: responseMessages.USER_SUSPENDED,
    }, res, req);
  }
  catch(err){
    console.error(err);
    return sendServerErrorResponse(
        { message: responseMessages.INTERNAL_SERVER_ERROR },
        res,
        req,
        err.message,
    );
  }
}


// exporting the functions :-
module.exports = {
    registerAdmin, loginAdmin, getAdminDetails, AdminLogOut, getUserDetails, suspendUser,
};