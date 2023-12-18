const express = require("express");
const authRoute = require("./auth.route");
const UserRouter = require("./UserRouter");
const PatientRouter = require("./PatientRouter");
const docsRoute = require("./docs.route");
const config = require("../../config/config");
const router = express.Router();

router.use("/users", UserRouter);
router.use("/auth", authRoute);
router.use("/patients", PatientRouter);
router.use("/docs", docsRoute);
module.exports = router;
