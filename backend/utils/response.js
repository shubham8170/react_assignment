// defining all responses here :-
module.exports = {
    responseMessages: {
        HOME_PAGE: 'This is the Home page',
        HOME_PAGE_FOUND_CODE: 'Home page not found',
        USER_CREATED_SUCCESSFUL: 'User created successfully',
        USER_LOGIN_SUCCESSFUL: 'User login successfully',
        INTERNAL_SERVER_ERROR: 'Something went wrong',
        USER_ALREADY_EXISTS: 'This email address is already registerd',
        USER_NOT_EXISTS: 'User does not exists',
        USER_GETTING_SUCCESSFUL: 'Here is the user details',
        USER_UPDATE_SUCCESSFUL: 'User updated successfully',
        NOTHING_TO_UPDATE: 'Nothing to update',
        TOKEN_AUTHENTICATION: 'Unautharize access',
        USER_LOGOUT_SUCCESSFUL: 'User logout successfull',
        INVALID_USERID: 'Invalid id',
        FOLLOWER_ADD_SUCCESSFUL: 'Following...',
        UNAUTHARIZED_ACCESS: 'Unautharize access',
        ALREADY_FOLLOW: 'You are already following this user',
        NOT_FOLLOWING: 'Not following',
        FOLLOWER_REMOVE_SUCCESSFUL: 'Follower remove successfully',
        POST_UPLOADED_SUCCESSFUL: 'Your post uploaded succesfully',
        POST_DELETED_SUCCESSFUL: 'Your post deleted succesfully',
        POST_EDITED_SUCCESSFUL: 'Your edited deleted succesfully',
        POST_LIKED_SUCCESSFUL: 'Your have succesfully like this post',
        POST_COMMENT_SUCCESSFUL: 'Your have succesfully comment on this post',
        POST_DETAILS:'Here is your post details',
        INVALID_POST: 'Invalid Post',
        INVALID_REQUEST: 'Invalid request',
        REGISTER_SUCCESSFUL: 'Register successful',
        USER_CHAT_LIST: 'Here is your userchat list',
        USER_CHAT: 'Here is your chat',
        USER_SUSPENDED: 'User suspended successfully',
        INVALID_ID: 'Invalid id',
        SAMENAME_CONTEST: 'This name is already used previously',
        CONTEST_CREATED_SUCCESSFULLY: 'Contest created successfully',
        CONTEST_NOT_FOUND: 'Contest not found',
        CONTEST_DELETED_SUCCESSFULLY: 'Contest deleted successfully',
        ENROLLMENT_SUCCESSFUL: 'Your have successfully enroll in this contest',
        ALREADY_ENROLLED: 'Your are already enrolled for this contest',
        INVALID_CONTEST_ID: 'Invalid contest id',
        NOT_ENROLLED: 'You have not enroll for this contest',
        CONTEST_DATA: 'Here is the contest data',
        USERNAME_NOT_AVAILABLE: 'This username is not available',
        USERNAME_UPDATED_SUCCESSFULLY: 'Your usernae updated successfully',
    },

    sendSuccessResponse: async (object, res, req) => {
        res.status(200).send(object);
    },

    sendSuccessResponseGetLogs: async (object, res) => {
        res.status(200).send(object);
    },

    sendCreatedResponse: (object, res) => {
        res.status(201).send(object);
    },

    sendBadRequestResponse: async (object, res, req) => {
        res.status(400).send(object);
    },

    sendUnauthorizedResponse: async (object, res, req) => {
        res.status(401).send(object);
    },

    sendForbiddenResponse: async (object, res, req) => {
        res.status(403).send(object);
    },

    sendNotFoundResponse: async (object, res, req) => {
        res.status(404).send(object);
    },

    sendUnprocessableResponse: async (object, res, req) => {
        res.status(422).send(object);
    },

    sendServerErrorResponse: async (object, res, req, error) => {
        res.status(500).send(object);
    },

    sendServerErrorResponseGetLogs: async (object, res) => {
        res.status(500).send(object);
    },

    sendBadGatewayResponse: (object, res) => {
        res.status(502).send(object);
    },

    sendResponse: (message, code, res) => {
        res.status(code).send(message);
    },
};