const UserRepo = require("../repo/UserRepo");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const {
    badRequest,
    errorResponse,
    successResponse,
} = require("../config/responceHandler");
const TokenRepo = require("../repo/TokenRepo");
const { otpRequest } = require("../utils/sendEmail");
const crypto = require("crypto");
const UserModel = require("../models/UserModel");
const { truncateSync } = require("fs");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET_KEY,
});

const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
};

const getConsultants = async (req, res, next) => {
    const consultants = await UserRepo.getAllUsers({ role: "consultant" });
    if (!consultants) {
        return badRequest(res, "No consultant found", [], 404);
    }
    return successResponse(
        res,
        "Consultants fetched successfully",
        consultants,
        200
    );
};

const createNewUser = async (req, res, next) => {
    /*  console.log("creating user"); */
    try {
        const { name, email, password, role, } = req.body;
        if (!email) {
            return badRequest(res, "Email Should be Correct!", email);
        }
        const checkUserExistence = await UserRepo.findOneByObject({ email });
        console.log("c", checkUserExistence)

        /*   if (checkUserExistence) { */
        if (checkUserExistence) {

            return badRequest(res, "Email address already in use", []);
        }
        /* return badRequest(res, "Email address already in use", []);

       } */

        /* if (checkUserExistence.verified === true) {
            return badRequest(res, "Please Verify Account by OTP", []);
        } */

        // Encrypting Password
        var salt = bcrypt.genSaltSync(10);
        var hashPass = bcrypt.hashSync(password, salt);

        const newUser = await UserRepo.createUser(name, email, hashPass, role);

        if (!newUser) {
            return errorResponse(res, "Issue Occured in Server", [], 500);
        }
        const otp = generateOTP();
        const token = await TokenRepo.createToken({
            userId: newUser?._id,
            email: newUser?.email,
            token: otp,
        });
        await otpRequest(
            name,
            "",
            otp,
            newUser?.email,
            "Your UME Health OTP Request"
        );
        successResponse(
            res,
            "Please check your email for your OTP",
            newUser,
            201
        );
    } catch (err) {
        next(err);
    }
};

/* const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        let User = await UserRepo.findOneByObject({ email });
        if (!User) {
            return badRequest(
                res,
                "User not found. Please ensure you are using the right credentials",
                []
            );
        }

        const isPasswordMatch = bcrypt.compareSync(password, User.password);
        if (!isPasswordMatch) {
            return badRequest(
                res,
                "Incorrect password, please try again",
                [],
                403
            );
        }
        if (!User?.verified) {
            let token = await TokenRepo.findOneByObject({ userId: User?._id });
            if (!token) {
                const otp = generateOTP();
                const token = await TokenRepo.createToken({
                    userId: User?._id,
                    email: User?.email,
                    token: otp,
                });
                await otpRequest(
                    User?.email,
                    User?.name,
                    "Your UME Health OTP Request",
                    token?.token
                );
            }
            return successResponse(
                res,
                "An email has been sent to your email address",
                [],
                402
            );
        }
        const userData = {
            name: User.name,
            email,
            image: User.image,
            role: User.role,
            _id: User?._id,
        };

        console.log("[UserController:login] Logged in Successfully");
        const token = jwt.sign({ User }, process.env.JWT_SECRET);

        successResponse(res, "Login successful", { userData, token }, 200);
    } catch (err) {
        next(err);
    }
}; */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        let user = await UserRepo.findOneByObject({ email });
        console.log(user)
        if (!user) {
            return badRequest(
                res,
                "User not found. Please ensure you are using the right credentials",
                []
            );
        }

        const isPasswordMatch = bcrypt.compareSync(password, user.password);

        if (!isPasswordMatch) {
            return badRequest(
                res,
                "Incorrect password, please try again",
                [],
                403
            );
        }
        console.log(user.statusId)
        if (user.statusId === 'inactive') {
            return badRequest(
                res,
                " User account is inactive. Please contact support for assistance.",
                [],
                403
            );
        }

        if (!user.verified) {
            return badRequest(
                res,
                "Please Verify Your Account by OTP",
                []
            );
        }
        if (!user.verified) {
            let token = await TokenRepo.findOneByObject({ userId: user._id });
            if (!token) {
                const otp = generateOTP();
                const token = await TokenRepo.createToken({
                    userId: user._id,
                    email: user.email,
                    token: otp,
                });
                await otpRequest(
                    user.email,
                    user.name,
                    "Your UME Health OTP Request",
                    token?.token
                );

                return successResponse(
                    res,
                    "An email has been sent to your email address",
                    [],
                    402
                );
            }
        }

        const userData = {
            name: user.name,
            email,
            image: user.image,
            role: user.role,
            statusId: user.statusId,
            _id: user._id,
            jobTitle: user.jobTitle
        };
        console.log("cc", userData)

        console.log("[UserController:login] Logged in Successfully");
        const token = jwt.sign({ user }, process.env.JWT_SECRET);

        successResponse(res, "Login successful", { userData, token }, 200);
    } catch (err) {
        next(err);
    }
};


const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    console.log("forgot password", email);
    let User = await UserModel.findOne({ email: email });
    console.log("email", User);
    if (!User) {
        return badRequest(
            res,
            "User not found. Please ensure you are using the right credentials",
            []
        );
    }
    // if (!User?.verified) {
    let token = await TokenRepo.findOneByObject({ userId: User?._id });
    if (token) {
        const existingToken = await TokenRepo.deleteToken({
            userId: User?._id,
        });
    }
    const otp = generateOTP();
    const newtoken = await TokenRepo.createToken({
        userId: User?._id,
        email: email,
        token: otp,
    });
    console.log({ User });
    await otpRequest(
        User?.name,
        User.lastName,
        newtoken?.token,
        User.email,
        "Your UME Health OTP Request"
    );

    return successResponse(
        res,
        "OTP sent to your email, Please verify",
        [],
        200
    );
    // }
};

const resetPassword = async (req, res, next) => {
    const { otp, password, email } = req.body;
    console.log("required credentials", otp, password, email);

    if (!otp || !password) {
        return badRequest(res, "OTP and new password are required", [], 400);
    }
    const user = await UserRepo.findOneByObject({ email: email });
    if (!user) {
        return badRequest(res, "Invalid Email", [], 400);
    }
    const token = await TokenRepo.findOneByObject({ userId: user?._id });

    if (token.token !== otp) {
        return badRequest(res, "Invalid OTP. Please double check and try again.", [], 400);
    }

    var salt = bcrypt.genSaltSync(10);
    var hashPass = bcrypt.hashSync(password, salt);
    const response = await UserModel.findOneAndUpdate(
        { _id: user?._id },
        { password: hashPass },
        { new: true }
    );
    if (!response) {
        return errorResponse(res, "Issue Occured in Server", [], 500);
    } else {
        return successResponse(res, "Password updated successfully", [], 200);
    }
};

const resendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;
        let User = await UserModel.findOne({ email });
        console.log("email", User);
        if (!User) {
            return badRequest(
                res,
                "User not found. Please ensure you are using the right credentials",
                []
            );
        }
        if (!User?.verified) {
            let token = await TokenRepo.findOneByObject({ userId: User?._id });
            if (token) {
                const existingToken = await TokenRepo.deleteToken({
                    userId: User?._id,
                });
            }

            const otp = generateOTP();
            newtoken = await TokenRepo.createToken({
                userId: User?._id,
                email: User?.email,
                token: otp,
            });
            await otpRequest(
                User?.name,
                User?.lastName,
                newtoken?.token,
                User.email,
                "Your UME Health OTP Request"
            );

            return successResponse(res, "OTP resent successfully", [], 200);
        }
    } catch (err) {
        next(err);
    }
};

const VerifyToken = async (req, res, next) => {
    try {
        console.log("body", req.body);
        const user = await UserRepo.findOneByObject({ email: req.body.email });
        console.log("user==>", user);
        if (!user) {
            return badRequest(res, "Invalid Email", [], 400);
        }
        if (user?.verified) {
            return badRequest(res, "Already Verified", [], 400);
        }
        const id = user?._id;
        const token = await TokenRepo.findOneByObject({
            userId: id,
            token: req.body.otp,
        });
        console.log("token", token);
        if (!token) {
            return badRequest(res, "Invalid OTP", [], 400);
        }
        await UserRepo.updateUser(id, true);
        await TokenRepo.deleteToken({ userId: id, token: token?.token });
        const userData = {
            name: user.name,
            email: user?.email,
            image: user.image,
            role: user.role,
            _id: user?._id,
        };
        return successResponse(
            res,
            "Email verified successfully",
            { userData },
            200
        );
    } catch (error) {
        next(error);
    }
};








/* const updateUserProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, password, ...additionalFields } = req.body;
        console.log("req.file", req.body);
        const status = req.body.check
        let imageUrl;
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(
                    req?.file?.path
                );
                imageUrl = result?.secure_url;
                console.log("imageURL", imageUrl);
            } catch (uploadError) {
                console.error(
                    "Error uploading image to Cloudinary:",
                    uploadError
                );
                // Handle the error or return an appropriate response
            }
        }
        console.log("CCC", status)

        // Update user information

        const updatedUser = await UserRepo.updateProfile(id, {
            name,
            email,

            password: password
                ? bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                : undefined,
            image: imageUrl,
            ...additionalFields,
        });


        if (!updatedUser) {
            return errorResponse(res, "Failed to update user profile", [], 500);
        }
        console.log("updatedUser", updatedUser);
        const userData = {
            name: updatedUser?.name,
            email,
            image: updatedUser?.image,
            role: updatedUser?.role,
            _id: updatedUser?._id,
        };
        successResponse(
            res,
            "Profile updated successfully",
            { ...updatedUser?._doc, userData },
            200
        );
    } catch (err) {
        next(err);
    }
}; */















/* const updateUserProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, password, ...additionalFields } = req.body;

        // Find the user by email
        const checkUserExistence = await UserRepo.findOneByObject({ email });
        console.log("c", checkUserExistence)

        let imageUrl;
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(
                    req?.file?.path
                );
                imageUrl = result?.secure_url;
                console.log("imageURL", imageUrl);
            } catch (uploadError) {
                console.error(
                    "Error uploading image to Cloudinary:",
                    uploadError
                );
                // Handle the error or return an appropriate response
            }
        }

        // Hash the password before updating the user profile
        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        // Update the user profile with the hashed password
        const updatedUser = await UserRepo.updateProfile(id, {
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            ...additionalFields,
        });

        if (!updatedUser) {
            return errorResponse(res, "Failed to update user profile", [], 500);
        }

        const userData = {
            name: updatedUser?.name,
            email,
            image: updatedUser?.image,
            role: updatedUser?.role,
            _id: updatedUser?._id,
        };

        successResponse(
            res,
            "Profile updated successfully",
            { ...updatedUser?._doc, userData },
            200
        );

    } catch (err) {
        next(err);
    }
}; */


const updateUserProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, password, ...additionalFields } = req.body;

        // Find the user by email
        const checkUserExistence = await UserRepo.findOneByObject({ email });
        if (checkUserExistence && checkUserExistence._id.toString() !== id) {
            return errorResponse(res, "Email already exists", [], 400);
        }

        // Check if secretaryEmail exists
        if (additionalFields.secretaryEmail) {
            // Find the user by secretaryEmail
            const checkSecretaryExistence = await UserRepo.findOneByObject({ email: additionalFields.secretaryEmail });
            if (checkSecretaryExistence && checkSecretaryExistence._id.toString() !== id) {
                return errorResponse(res, "Secretary Email already exists", [], 400);
            }
        }

        let imageUrl;
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req?.file?.path);
                imageUrl = result?.secure_url;
                console.log("imageURL", imageUrl);
            } catch (uploadError) {
                console.error("Error uploading image to Cloudinary:", uploadError);
                // Handle the error or return an appropriate response
            }
        }

        // Hash the password before updating the user profile
        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        // Update the user profile with the hashed password
        const updatedUser = await UserRepo.updateProfile(id, {
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            ...additionalFields,
        });

        if (!updatedUser) {
            return errorResponse(res, "Failed to update user profile", [], 500);
        }

        const userData = {
            name: updatedUser?.name,
            email,
            image: updatedUser?.image,
            role: updatedUser?.role,
            _id: updatedUser?._id,
        };

        successResponse(res, "Profile updated successfully", { ...updatedUser?._doc, userData }, 200);

    } catch (err) {
        next(err);
    }
}





/* const updateUserProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, password, ...additionalFields } = req.body;
        console.log("req.file", req.body);
        const status = req.body.check === true || req.body.check === "true";
        const user = await UserRepo.findOneByObject({ email: req.body.email });
        if (user.password !== password) {
            return errorResponse(res, " Incorrect Password", [], 500);
        }



        let imageUrl;
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(
                    req?.file?.path
                );
                imageUrl = result?.secure_url;
                console.log("imageURL", imageUrl);
            } catch (uploadError) {
                console.error(
                    "Error uploading image to Cloudinary:",
                    uploadError
                );
                // Handle the error or return an appropriate response
            }
        }

       

        let updatedUser;
        if (status) {
            updatedUser = await UserRepo.updateProfile(id, {
                name,
                email,
                password: password,
                image: imageUrl,
                ...additionalFields,
            });
            console.log("updatedUser", updatedUser);

        } else {
            updatedUser = await UserRepo.updateProfile(id, {
                name,
                email,
                password: password
                    ? bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                    : undefined,
                image: imageUrl,
                ...additionalFields,
            });
            console.log("updatedUser1", updatedUser);

        }


        if (!updatedUser) {
            return errorResponse(res, "Failed to update user profile", [], 500);
        }
        const userData = {
            name: updatedUser?.name,
            email,
            image: updatedUser?.image,
            role: updatedUser?.role,
            _id: updatedUser?._id,
        };
        successResponse(
            res,
            "Profile updated successfully",
            { ...updatedUser?._doc, userData },
            200
        );

        // Update user information




    } catch (err) {
        next(err);
    }
}; */

const getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id; // Assuming your route has a parameter for the user ID
        const user = await UserRepo.findOneByObject({ _id: userId });

        if (!user) {
            return errorResponse(
                res,
                "User not found. Please ensure you are using the right credentials",
                [],
                404
            );
        }

        return successResponse(
            res,
            "User data retrieved successfully",
            user,
            200
        );
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
    getUserById,
    getConsultants,
    forgotPassword,
    resetPassword,
};
