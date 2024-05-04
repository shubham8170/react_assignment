require('dotenv').config();

const config = process.env;
const jwt = require('jsonwebtoken');
const { responseMessages } = require('../../utils/response');
const { findAllItems } = require('../../utils/dbMethods');

// defining AuthService :-
class AuthService {
    static async jwtTokenCreate(userInfo) {
        const token = jwt.sign(
            {
                _id: userInfo._id,
                name: userInfo.name,
                email: userInfo.email,
                isActive: userInfo.isActive,
            },
            config.JWT_TOKEN_KEY,
            {
                expiresIn: 6 * 30 * 24 * 60 * 60,
            },
        );
        return token;
    }

    static async validateUserId(userId) {
        if (!userId) {
            return false;
        }
        const hexPattern = /^[0-9a-fA-F]{24}$/;
        if (!userId || !hexPattern.test(userId.trim())) {
            return false;
        }
        return true;
    }

}

// exporting AuthService :-
module.exports = AuthService;