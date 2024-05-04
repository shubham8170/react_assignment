const { Chat, User } = require('../../models/index');
const { createItem, findItem, updateItem, findAllItems, findAllItemsDesc } = require('../../utils/dbMethods');
const {
    responseMessages, sendBadRequestResponse, sendServerErrorResponse, sendNotFoundResponse, sendForbiddenResponse, sendUnauthorizedResponse, sendSuccessResponse,
} = require('../../utils/response');

const getChatUser = async (req, res) => {
    try {
        const userId = req.params.userid;
        const senderData = await findAllItems({ receiverId: userId }, Chat);
        const receiverData = await findAllItems({ senderId: userId }, Chat);

        // Create a Set to store unique user IDs
        const uniqueIds = new Set();

        // Add sender and receiver IDs to the Set
        for (const item of senderData) {
            uniqueIds.add(item.senderId);
        }
        for (const item of receiverData) {
            uniqueIds.add(item.receiverId);
        }
        // Convert Set to an array
        const Ids = Array.from(uniqueIds);
        const chatUsers = [];
        for (const id of Ids) {
            const userData = await findItem(
                { _id: id, isActive: true, isSuspended: false },
                User
            );
            const user = userData.toObject();
            delete user.password;
            delete user.isActive;
            delete user.isSuspended;

            chatUsers.push(user);
        }
        return sendSuccessResponse(
            { message: responseMessages.USER_CHAT_LIST, data: chatUsers },
            res,
            req
        );
    } catch (err) {
        console.error(err);
        return sendServerErrorResponse(
            { message: responseMessages.INTERNAL_SERVER_ERROR },
            res,
            req,
            err.message
        );
    }
};

const getChat=async (req,res)=>{
    try{
        const {userId, seconduserId} = req.query;
        const receiverData = await findAllItems({ receiverId: userId, senderId:seconduserId }, Chat);
        const senderData = await findAllItems({ receiverId:seconduserId, senderId: userId }, Chat); 
        let chats=[];
        for (const item of senderData) {
            chats.push(item)
        }
        for (const item of receiverData) {
            chats.push(item)
        }
        // console.log(receiverData, senderData);
        chats.sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
          });

          return sendSuccessResponse(
            { message: responseMessages.USER_CHAT, data: chats },
            res,
            req
        );
    }
    catch(err){
        console.error(err);
        return sendServerErrorResponse(
            { message: responseMessages.INTERNAL_SERVER_ERROR },
            res,
            req,
            err.message
        );
    }
}

const sendMessage = async(req,res)=>{
    try{
        const {senderId,rceiverId, message} = req.body;

    }
    catch(err){

    }
}

const getUserInfo = async (userId)=>{
    try{
        const userData = await findItem({_id:userId},User);
        return userData?.firstname+" " +userData?.lastname;
    }
    catch(err){
        console.log(err.message);
        return null;
    }
}

const storeChats = async(chatData)=>{
  try{
    console.log(chatData);
    await createItem(chatData,Chat);
    console.log('Chat saved into db');
  }
  catch(err){
    console.log('error during saving the chat into DB ', err.message);
  }
}

module.exports = {getChatUser, getUserInfo, storeChats, getChat}
