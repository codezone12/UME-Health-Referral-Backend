const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/UserController')

router.post('/', UserController.createNewUser)
router.post('/login', UserController.login)
router.post('/otp', UserController.VerifyToken)



module.exports = router