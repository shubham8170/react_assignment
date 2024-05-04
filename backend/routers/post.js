// importing & using router, controllers function, middlewares :-
const { Router } = require('express');

const router = Router();
const {
    addPost, deletePost, editPost, likePost, getAllPosts, getUserAllPosts, commentPost, getPostDetails
} = require('../controllers/post');
const { upload } = require('../middlewares/uploadFile')
const {
    validateAuth, validateId, validateFollow,
} = require('../middlewares/validation');

// defining router :-
router.post('/addpost/:id', validateAuth, upload.single('file'), addPost);
router.delete('/deletepost', validateAuth, deletePost);
router.patch('/editPost', validateAuth, editPost);
router.post('/like', validateAuth, likePost);
router.post('/comment', validateAuth, commentPost);
router.get('/postdetail/:id', validateAuth, getPostDetails)
router.get('/getposts', validateAuth, getAllPosts);
router.get('/getposts/:id', getUserAllPosts);


// exporting the router :-
module.exports = router;