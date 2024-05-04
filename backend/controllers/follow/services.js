require('dotenv').config();

const config = process.env;


// defining AuthService :-
class FollowService {
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
module.exports = FollowService;