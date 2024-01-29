/* const ReferralRepo = require("../repo/ReferralRepo"); */
/* const ReferralRepo = require("../repo/ReferralRepo"); */
const path = require("path");
const ReferralRepo = require(path.join(__dirname, "../repo/ReferralRepo"));
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




const newReferral = async (req, res, next) => {
    try {
        const patientData = req.body;

        if (req.file) {
            // Upload the PDF file to Cloudinary
            cloudinary.uploader
                .upload_stream(
                    {
                        /*  resource_type: "raw",
                         public_id: `patient_files/${patientData?.firstName + " " + patientData?.lastName}${Date.now()}.pdf`,
  */
                        public_id: `patient_files/${patientData?.firstName + " " + patientData?.lastName
                            }${Date.now()}.pdf`,
                    },
                    async (error, result) => {
                        if (error) {
                            console.error(error);
                            return next(error);
                        }

                        patientData.pdfURL = result.secure_url;

                        try {
                            const newReferral = await ReferralRepo.newReferral(
                                patientData
                            );
                            successResponse(
                                res,
                                "Referral created successfully",
                                newReferral,
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
                const newReferral = await ReferralRepo.newReferral(patientData);
                successResponse(
                    res,
                    "Referral created successfully",
                    newReferral,
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



/**
 * @param {Object} req.params - Patient ID
 * @returns {referralModel}
 */
const getReferralById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const referral = await ReferralRepo.findOneReferralByObject({ _id: id });
        if (!referral) {
            return badRequest(res, "Referral not found.", []);
        }
        successResponse(res, "Referral retrieved successfully.", referral, 200);
    } catch (error) {
        next(error);
    }
};


/**
 * @param {Object} req.params - Patient ID
 * @param {Object} req.body - Updated patient data
 * @returns {referralModel}
 */
const updateReferral = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const consultant = await UserModel.findById(data.consultant);

        if (req.file) {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",
                    public_id: `patient_files/${data.firstName} ${data.lastName}_${Date.now()}.pdf`,
                },
                async (error, result) => {
                    if (error) {
                        console.error(error);
                        return next(error);
                    }

                    data.pdfURL = result.secure_url;

                    try {
                        const updateReferral = await ReferralRepo.updateReferral(id, data);
                        successResponse(res, "Referral updated successfully", updateReferral, 200);
                    } catch (dbError) {
                        next(dbError);
                    }
                }
            ).end(req.file.buffer);
        } else {
            try {
                const updateReferral = await ReferralRepo.updateReferral(id, data);
                const referral = await referralModel.findOne({ _id: id });
                const admin = await UserModel.findOne({ role: "Admin" });

                const name = `${referral.title} ${referral.firstName} ${referral.lastName}`;

                await referralConfirmation(
                    admin.name,
                    admin.email,
                    "A new UME Health referral has been created",
                    data.pdfURL
                );

                await referralConfirm(
                    name,
                    referral.email,
                    "A new UME Health referral has been created",
                    updateReferral.pdfURL
                );

                await referralConfirmed(

                    consultant.name,
                    consultant.email,
                    "A new UME Health referral has been created",
                    updateReferral.pdfURL
                );

                successResponse(res, "Profile updated successfully", updateReferral, 200);
            } catch (dbError) {
                next(dbError);
            }
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @param {Object} req.params - Patient ID
 * @returns {boolean}
 */
const deleteReferral = async (req, res, next) => {
    try {
        const { id } = req.params;
        const isDeleted = await ReferralRepo.deleteReferral(id);
        if (!isDeleted) {
            return badRequest(res, "Referral not found.", []);
        }
        successResponse(res, "Referral deleted successfully.", [], 200);
    } catch (error) {
        next(error);
    }
};



const uploadReportByAdmin = async (req, res, next) => {
    const { id } = req.params;

    try {
        if (req.file) {
            cloudinary.uploader
                .upload_stream(
                    {
                        resource_type: "raw",
                        public_id: `patient_files/${Date.now()}.pdf`,
                    },
                    async (error, result) => {
                        if (error) {
                            console.error("error===>", error);
                            return errorResponse(
                                res,
                                "Error uploading report",
                                error
                            );
                        }

                        const finalReport = result.secure_url;
                        console.log("finalReport====", finalReport);
                        const updatedReferral = await ReferralRepo.updateReferral(
                            id,
                            {
                                finalReport,
                                adminResponse: true,
                                pending: false,
                            }
                        );

                        if (!updatedReferral) {
                            return badRequest(
                                res,
                                "Something went wrong, please try again",
                                []
                            );
                        }
                        console.log(
                            "updatedPatient====",
                            updatedReferral.consultant
                        );
                        const consultant = await userModel.findOne({
                            _id: updatedReferral.consultant.id,
                        });
                        // Pass the 'id' to the informConsultant function
                        /*  await informConsultant(
                             consultant.name,
                             consultant.email,
                             "Re: Your UME Health Patient Referral",
                             finalReport,
                             id
                         );
                         return successResponse(
                             res,
                             "Report submitted successfully",
                             updatedPatient,
                             200
                         ); */
                    }
                )
                .end(req.file.buffer);
        } else {
            return errorResponse(res, "No file provided", []);
        }
    } catch (error) {
        console.error("Unhandled error:", error);
        next(error);
    }
};
module.exports = {
    getAllReferrals,
    createReferral,
    getReferralById,
    updateReferral,
    deleteReferral,
    newReferral,
    uploadReportByAdmin


};
