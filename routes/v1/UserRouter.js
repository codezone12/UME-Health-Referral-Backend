const express = require("express");
const router = express.Router();
const UserController = require("../../controllers/UserController");
const uploader = require("../../middlewares/imageUploader");

router.post("/", UserController.createNewUser);
router.get("/", UserController.getConsultants);
router.post("/login", UserController.login);
router.post("/forgotPassword", UserController.forgotPassword);
router.get("/:id", UserController.getUserById);
router.post("/otp", UserController.VerifyToken);
router.post("/resend/otp", UserController.resendOTP);
router.patch(
    "/:id",
    uploader.single("image"),
    UserController.updateUserProfile
);

module.exports = router;
