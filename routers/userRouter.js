const express = require('express');
const appExport = require('../models/app');
const app = appExport[1];
const multer = require('multer');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { mongoose: mongooseLostChild } = require('../lostchild');
const { mongoose: mongooseFoundChild } = require('../foundchild');
const { mongoose: mongooseTrackChild } = require('../trackchild');

const allowedOrigins = ['http://192.168.216.71:5501', 'http://192.168.1.103:5501','http://192.168.1.104:5501','http://192.168.1.105:5501', 'http://192.168.1.101:5501', 'http://192.168.1.102:5501','http://192.168.1.100:5501', "http://192.168.1.107:5501", "http://192.168.1.99:5501", "http://192.168.1.109:5501"]; // for cookies always specify the domain 
const corsOptions = {
    origin: function(origin, callback) {
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const ImageSchema = new mongooseLostChild.Schema({
    filename: String,
    url: String,
    uploadDate: { type: Date, default: Date.now },
    imageType: { type: String, required: true }
});

const Image = mongooseLostChild.model('Image', ImageSchema);

const {postSignUp, LoginUser, checklogin, forgotPassword, resetPassword, logout, getName} = require('../controller/userController');

//mini app
const userRouter = express.Router();
app.use('/user', userRouter)

userRouter
.route('/signup')
.post(postSignUp)
// .patch(updateUser)
// .delete(deleteUser)

userRouter
.route('/login')
.post(LoginUser)
.get(checklogin)

userRouter
.route('/forgotPassword')
.post(forgotPassword)

userRouter
.route('/resetPassword')
.post(resetPassword)

userRouter
.route('/logout')
.get(logout)

const firstImageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'D:/Tech.M/khoya-paya/missingChild_Image'); // First folder
    },
    filename: function(req, file, cb) {
        cb(null, `firstImage-${Date.now()}.jpeg`);
    }
});

const firstImageFilter = function(req, file, cb) {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an Image! Please upload an image'), false);
    }
};

const uploadFirstImage = multer({
    storage: firstImageStorage,
    fileFilter: firstImageFilter
});

// Configuration for the second image type
const secondImageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'D:/Tech.M/khoya-paya/foundChild_image'); // Second folder
    },
    filename: function(req, file, cb) {
        cb(null, `secondImage-${Date.now()}.jpeg`);
    }
});

const secondImageFilter = function(req, file, cb) {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an Image! Please upload an image'), false);
    }
};

const uploadSecondImage = multer({
    storage: secondImageStorage,
    fileFilter: secondImageFilter
});

userRouter.post("/missingChildImage", uploadFirstImage.single('photo'), async (req, res) => {
    try {
        const imageUrl = `/missingChild_Image/${req.file.filename}`;
        const newImage = new Image({
            filename: req.file.filename,
            url: imageUrl,
            imageType: 'lost' // Specify type here
        });
        await newImage.save();
        res.status(200).json({
            status: 'success',
            message: 'Image uploaded successfully!',
            file: req.file,
            imageUrl: imageUrl
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
});

userRouter.post("/secondImage", uploadSecondImage.single('photo'), async (req, res) => {
    try {
        const imageUrl = `/foundChild_Image/${req.file.filename}`;
        const newImage = new Image({
            filename: req.file.filename,
            url: imageUrl,
            imageType: 'found' // Specify type here
        });
        await newImage.save();
        res.status(200).json({
            status: 'success',
            message: 'Image uploaded successfully!',
            file: req.file,
            imageUrl: imageUrl
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
});

// Route to get the latest image
userRouter.get('/latestImage', async (req, res) => {
    try {
        const latestImage = await Image.findOne({ imageType: 'lost' }).sort({ uploadDate: -1 });
        if (!latestImage) {
            return res.status(404).json({ status: 'fail', message: 'No first type image found' });
        }
        res.status(200).json(latestImage);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

userRouter.get('/foundchildImage', async (req, res) => {
    try {
        const latestImage = await Image.findOne({ imageType: 'found' }).sort({ uploadDate: -1 });
        if (!latestImage) {
            return res.status(404).json({ status: 'fail', message: 'No second type image found' });
        }
        res.status(200).json(latestImage);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});


module.exports = userRouter;