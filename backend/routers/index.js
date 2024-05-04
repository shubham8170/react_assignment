const express = require('express');
const path = require('path');

const auth = require('./auth');
const follow = require('./follow');
const post = require('./post');
const chat = require('./chat');
const admin = require('./admin');
const contest = require('./contest');
const { upload, awsUpload } = require('../middlewares/uploadFile')


const router = express.Router();

router.use('/health', (req, res) => {
    res.send('This server is up and running');
});
router.use('/auth', auth);
router.use('/follow', follow);
router.use('/post', post);
router.post('/upload', upload.single('avatar'), async (req, res) => {
    try {
        console.log(req.file);
        const file = req.file;
        imageName = file.originalname.replace(/\s/g, '');
        const fileKey = `uploads/${Date.now()}${path.extname(imageName)}`;
        const imageUrl = await awsUpload(file, fileKey);
        return res.status(200).send({ imageUrl })
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({ message: err.message })
    }
})

router.use('/chat', chat);
router.use('/admin', admin);
router.use('/contest', contest);


module.exports = router;