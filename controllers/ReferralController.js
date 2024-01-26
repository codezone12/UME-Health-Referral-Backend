const ReferralRepo = require("../repo/ReferralRepo");
const {
    badRequest,
    successResponse,
    errorResponse,
} = require("../config/responceHandler");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");
const patientModel = require("../models/PatientModel");
const referralModel = require("../models/ReferralModel")
const userModel = require("../models/UserModel");
const httpStatus = require("http-status");
const {
    referralConfirmation,
    referralConfirm,
    informConsultant,
    referralConfirmed,
} = require("../utils/sendEmail");
const UserModel = require("../models/UserModel");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET_KEY,
});

const getAllReferrals = async (req, res, next) => {
    console.log("getAllReferrals");
    try {
        const referrals = await ReferralRepo.getAllReferrals();
        successResponse(res, "Referrals retrieved successfully.", referrals, 200);
    } catch (error) {
        next(error);
    }
};


/**
 * @param {Object} req.body - Patient data
 * @returns {referralModel}
 */

const createReferral = async (req, res, next) => {
    try {
        const patientData = req.body;

        if (req.file) {
            // Upload the PDF file to Cloudinary
            cloudinary.uploader
                .upload_stream(
                    {
                        resource_type: "raw",
                        public_id: `patient_files/${patientData?.firstName + " " + patientData?.lastName}${Date.now()}.pdf`,

                        /* public_id: `patient_files/${patientData?.firstName + " " + patientData?.lastName
                            }${Date.now()}.pdf`, */
                    },
                    async (error, result) => {
                        if (error) {
                            console.error(error);
                            return next(error);
                        }

                        patientData.pdfURL = result.secure_url;

                        try {
                            const newPatient = await ReferralRepo.createReferral(
                                patientData
                            );
                            successResponse(
                                res,
                                "Referral created successfully",
                                newPatient,
                                201
                            );
                        } catch (dbError) {
                            next(dbError);
                        }
                    }
                )
                .end(req.file.buffer);
        } else {
            try {
                const newPatient = await ReferralRepo.createReferral(patientData);
                successResponse(
                    res,
                    "Referral created successfully",
                    newPatient,
                    201
                );
            } catch (dbError) {
                next(dbError);
            }
        }
    } catch (error) {
        next(error);
    }
};





/* const patientUpdateRequest = async (req, res, next) => {
    console.log("patientUpdateRequest");
    const { pdfURL, id, name, patientName } = req.body;
    console.log("patient", patientName, name,);

    try {
        const patient = await patientModel.findOne({ _id: id });
        
        const user = await userModel.findOne({
            _id: patient.consultant.toString(),
        });
        const mailOptions = {
            from: "sohailshabir282@gmail.com",
            to: "codezone67@gmail.com",
            subject: "Request for Update",
            html: `
        <p>Hello,</p>
        <p>Consultant <strong>${user.name} </strong> has requested an update on the referral they made for the patient <strong>${patientName}.</strong></p>
        <p>Regards, <br>
        UME Health Client Relations Team</p>
      `,
        };
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASSWORD,
            },
        });

        const info = await transporter.sendMail(mailOptions);
        const updatedPatient = await PatientRepo.updatePatient(id, {
            updateRequest: true,
        });

        if (patient?.lastTimeMailSent > Date.now()) {
            console.log("Cant sent mail wait 12 hours");
            return errorResponse(
                res,
                "A copy of the referral has been sent to your email",
                [],
                httpStatus.INTERNAL_SERVER_ERROR
            );
        } else {
            console.log("last time updated");
            await patientModel.findOneAndUpdate(
                { _id: id },
                { lastTimeMailSent: Date.now() + 43200000 }
            );
            return successResponse(
                res,
                "A reminder has been sent to UME Health and you should get an update shortly.",
                updatedPatient,
                200
            );
        }
    } catch (error) {
        next(error);
    }
}; */






module.exports = {

    createReferral,


};
