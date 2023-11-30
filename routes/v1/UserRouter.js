const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/UserController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadImage = upload.single('image'); 


router.post('/',  UserController.createNewUser)
router.post('/login', UserController.login)
router.get('/:id', UserController.getUserById)
router.post('/otp', UserController.VerifyToken)
router.post('/resend/otp', UserController.resendOTP)
router.patch('/:id', uploadImage , UserController.updateUserProfile)



module.exports = router