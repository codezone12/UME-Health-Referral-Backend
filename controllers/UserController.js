const UserRepo = require('../repo/UserRepo')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { badRequest, errorResponse, successResponse } = require('../config/responceHandler')
const TokenRepo = require('../repo/TokenRepo')
const sendMail = require('../utils/sendEmail')
const crypto = require('crypto')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
};
const createNewUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body
        if (!email) {
            return badRequest(res, 'Email Should be Correct!', email)
        }
        const checkUserExistence = await UserRepo.findOneByObject({ email })
        if (checkUserExistence) {
            return badRequest(res, "Email Already Registered", [])
        }
        // Encrypting Password
        var salt = bcrypt.genSaltSync(10);
        var hashPass = bcrypt.hashSync(password, salt);

        const newUser = await UserRepo.createUser(name, email, hashPass, role)

        if (!newUser) {
            return errorResponse(res, 'Issue Occured in Server', [], 500)
        }
        const otp = generateOTP();
        const token = await TokenRepo.createToken(
            {
                userId: newUser?._id,
                email: newUser?.email,
                token: otp
            }
        )
        await sendMail(newUser?.email, newUser?.name, "Verify Email", otp)
        successResponse(res, 'An Email sent to your account please verify', newUser, 201)

    } catch (err) {
        next(err)
    }
}

const login = async (req, res, next) => {
    try {

        const { email, password } = req.body
        let User = await UserRepo.findOneByObject({ email })
        if (!User) {
            return badRequest(res, 'User Not Found', [])
        }

        const isPasswordMatch = bcrypt.compareSync(password, User.password);
        if (!isPasswordMatch) {
            return badRequest(res, 'Password Does not Match!', [], 403)
        }
        if (!User?.verified) {
            let token = await TokenRepo.findOneByObject({ userId: User?._id })
            if (!token) {

                const otp = generateOTP();
                const token = await TokenRepo.createToken(
                    {
                        userId: User?._id,
                        email: User?.email,
                        token: otp
                    }
                )
                await sendMail(User?.email, User?.name, "Verify Email", token?.token)
            }
            return successResponse(res, "An Email Sent to your account please verify", [], 402)
        }
        const userData = {
            name: User.name,
            email,
            image: User.image,
            role: User.role,
            _id : User?._id
        }

        console.log("[UserController:login] Logged in Successfully")
        const token = jwt.sign({ User }, process.env.JWT_SECRET)

        successResponse(res, 'Login Successful.', { userData, token }, 200)
    } catch (err) {
        next(err)
    }
}
const resendOTP = async (req, res, next) => {
    try {

        const { email } = req.body
        let User = await UserRepo.findOneByObject({ email })
        if (!User) {
            return badRequest(res, 'User Not Found', [])
        }
        if (!User?.verified) {
            let token = await TokenRepo.findOneByObject({ userId: User?._id })
            if (token) {
                const existingToken = await TokenRepo.deleteToken({ userId: User?._id })
            }
                const otp = generateOTP();
                 newtoken = await TokenRepo.createToken(
                    {
                        userId: User?._id,
                        email: User?.email,
                        token: otp
                    }
                )
                await sendMail(User?.email, User?.name, "Verify Email", newtoken?.token)
        
            successResponse(res, 'OTP Sent Successful.', [], 200)
        }
    } catch (err) {
        next(err)
    }
}



const VerifyToken = async (req, res, next) => {
    try {
        console.log('body', req.body);
        const user = await UserRepo.findOneByObject({ email: req.body.email })
        console.log('user==>', user);
        if (!user) {
            return badRequest(res, "Invalid Email", [], 400)
        }
        if (user?.verified) {
            return badRequest(res, "Already Verified", [], 400)
        }
        const id = user?._id
        const token = await TokenRepo.findOneByObject({
            userId: id,
            token: req.body.otp
        })
        console.log('token', token);
        if (!token) {
            return badRequest(res, "Invalid OTP", [], 400)
        }
        await UserRepo.updateUser(id, true)
        await TokenRepo.deleteToken({ userId: id, token: token?.token })
        return successResponse(res, "Email verified successfully", [], 200)
    } catch (error) {
        next(error)
    }
}


const updateUserProfile = async (req, res, next) => {
try {
    const { id } = req.params; 
    const { name, email, password, ...additionalFields } = req.body;
    console.log('req.file', req.file);
    let imageUrl;
    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.buffer.toString('base64'));
            imageUrl = result.secure_url;
            console.log('imageURL', imageUrl);
          } catch (uploadError) {
            console.error('Error uploading image to Cloudinary:', uploadError);
            // Handle the error or return an appropriate response
          }
    }

    // Update user information
    const updatedUser = await UserRepo.updateProfile(id, {
      name,
      email,
      password: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10)) : undefined,
      image: imageUrl,
      ...additionalFields,
    });

    if (!updatedUser) {
      return errorResponse(res, 'Failed to update user profile', [], 500);
    }

    successResponse(res, 'Profile updated successfully', updatedUser, 200);
  } catch (err) {
    next(err);
  }
}

const getUserById = async (req, res, next) => {
    try {
      const userId = req.params.id; // Assuming your route has a parameter for the user ID
      const user = await UserRepo.findOneByObject({_id:userId});
  
      if (!user) {
        return errorResponse(res, 'User not found', [], 404);
      }
  
      return successResponse(res, 'User data retrieved successfully', user, 200);
    } catch (error) {
      next(error);
    }
  };

module.exports = {
    createNewUser,
    login,
    VerifyToken,
    resendOTP,
    updateUserProfile,
    getUserById
}