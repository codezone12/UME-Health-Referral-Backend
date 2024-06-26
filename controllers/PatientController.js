const PatientRepo = require("../repo/PatientRepo");
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
const ReferralModel = require("../models/ReferralModel");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET_KEY,
});
/**
 * @returns {Array}
 */
const getAllPatients = async (req, res, next) => {
    console.log("getAllPatients");
    try {
        const patients = await PatientRepo.getAllPatients();
        successResponse(res, "Patients retrieved successfully.", patients, 200);
    } catch (error) {
        next(error);
    }
};

/**
 * @param {Object} req.body - Patient data
 * @returns {PatientModel}
 */
const createPatient = async (req, res, next) => {
    try {
        const patientData = req.body;

        if (req.file) {
            // Upload the PDF file to Cloudinary
            cloudinary.uploader
                .upload_stream(
                    {
                        resource_type: "raw",
                        public_id: `patient_files/${patientData?.firstName + " " + patientData?.lastName + "-" + patientData?.date}.pdf`,

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
                            const newPatient = await PatientRepo.createPatient(
                                patientData
                            );
                            successResponse(
                                res,
                                "Patient created successfully",
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
                const newPatient = await PatientRepo.createPatient(patientData);
                successResponse(
                    res,
                    "Patient created successfully",
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
/**
 * @param {Object} req.params - Patient ID
 * @returns {PatientModel}
 */
const getPatientById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const patient = await PatientRepo.findOnePatientByObject({ _id: id });
        if (!patient) {
            return badRequest(res, "Patient not found.", []);
        }
        successResponse(res, "Patient retrieved successfully.", patient, 200);
    } catch (error) {
        next(error);
    }
};

/**
 * @param {Object} req.params - Patient ID
 * @param {Object} req.body - Updated patient data
 * @returns {PatientModel}
 */
const updatePatient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        console.log("formdata;", data)

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
                        const updatedPatient = await PatientRepo.updatePatient(id, data);
                        successResponse(res, "Patient updated successfully", updatedPatient, 200);
                    } catch (dbError) {
                        next(dbError);
                    }
                }
            ).end(req.file.buffer);
        } else {
            try {
                const updatedPatient = await PatientRepo.updatePatient(id, data);
                const patient = await patientModel.findOne({ _id: id });
                const admin = await UserModel.findOne({ role: "Admin" });

                const name = `${patient.title} ${patient.firstName} ${patient.lastName}`;

                await referralConfirmation(
                    admin.name,
                    admin.email,
                    "A new UME Health referral has been created",
                    data.pdfURL
                );

                await referralConfirm(
                    name,
                    patient.email,
                    "A new UME Health referral has been created",
                    updatedPatient.pdfURL
                );

                await referralConfirmed(

                    consultant.name,
                    consultant.email,
                    "A new UME Health referral has been created",
                    updatedPatient.pdfURL
                );

                successResponse(res, "Profile updated successfully", updatedPatient, 200);
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
const deletePatient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const isDeleted = await PatientRepo.deletePatient(id);
        if (!isDeleted) {
            return badRequest(res, "Patient not found.", []);
        }
        successResponse(res, "Patient deleted successfully.", [], 200);
    } catch (error) {
        next(error);
    }
};

const patientUpdateRequest = async (req, res, next) => {
    console.log("patientUpdateRequest");
    const { pdfURL, id, name, patientName: originalPatientName } = req.body;
    console.log("patient", originalPatientName, name);

    try {
        const referral = await ReferralModel.findOne({ _id: id });
        const patientName = referral.title + " " + referral.firstName + " " + referral.lastName;
        console.log("patientName:", patientName);

        const user = await userModel.findOne({
            _id: referral.consultant.toString(),
        });
        const imageUrl = "https://res.cloudinary.com/dxa2sfens/image/upload/v1704871962/samples/yzj44igafl1acu9pguvt.png";
        const mailOptions = {
            from: "sohailshabir282@gmail.com",
            to: "codezone67@gmail.com",
            subject: "Re: referral update request",
            html: `
                <p>Hello,</p>
                <p><strong>${user.name} </strong> has requested an update on the referral they made for the patient <strong>${patientName}.</strong></p>
                <p>Regards, <br>
                UME Health Client Relations Team</p>
                
                 <img src="${imageUrl}" alt="UME Health Image" style="height: 50px;"/>
                  <br>
                 17 Harley Street, Marylebone, London W1G 9QH<br>
                 Telephone: 0207 467 6190<br>
                 Email: <a href="mailto:bookings@umegroup.com">bookings@umegroup.com</a><br>
                 Web: www.umehealth.co.uk<br>

                <h2>Disclaimer and Confidentiality Note:</h2>

                Everything in this email and any attachments relating to the official business of UME Group LLP is proprietary to the company.
            
                It is confidential, legally privileged by law. UME does not own and endorse any other content. Views and opinions are those of the sender unless clearly stated as being that of UME Group.
            
                The person addressed in the email is the sole authorized recipient. Please notify the sender immediately if it has unintentionally reached you and do not read, disclose or use the content in any way. Please destroy the communication and all attachments immediately.
            
                UME Group cannot assure that the integrity of this communication has been maintained or that it is free from errors, virus, interception or interference.
            
                UME Group LLP, 17 Harley St, London W1G 9QH, Tel: 020 7391 8660 Fax: 020 7391 8666
                Registered in the UK. Registration number: OC333533
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
            console.log("Can't send mail, wait 12 hours");
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
                "A reminder has been sent to UME Health, and you should get an update shortly.",
                updatedPatient,
                200
            );
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

const patientProfile = async (req, res, next) => {
    console.log("patientProfile");
    const { pdfURL, id, name } = req.body;
    try {
        const mailOptions = {
            from: "sohailshabir282@gmail.com",
            to: "mubeen@mailinator.com",
            subject: "Request for Update",
            html: `
        <p>Hello,</p>
        <p>We hope this message finds you well.</p>
        <p>We would like to request an update regarding referral of patient ${name}. Please provide any additional information or updates that may be relevant to your case.</p>
        <p>PDF is attached <a href=${pdfURL} > Here</a></p>
        <p>Thank you for your cooperation.</p>
        <p>Best regards,</p>
        <p>Your Organization</p>
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
        if (info) {
            const updatePatient = await PatientRepo?.updatePatient(id, {
                pending: true,
            });
            return successResponse(
                res,
                "Request Update Sent Successfully",
                info,
                200
            );
        } else {
            return errorResponse(
                res,
                "Something went wrong please try again ",
                []
            );
        }
    } catch (error) {
        next(error);
    }
};

/* const uploadReportByAdmin = async (req, res, next) => {
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
                        const updatedPatient = await PatientRepo.updatePatient(
                            id,
                            {
                                finalReport,
                                adminResponse: true,
                                pending: false,
                            }
                        );

                        if (!updatedPatient) {
                            return badRequest(
                                res,
                                "Something went wrong, please try again",
                                []
                            );
                        }
                        console.log(
                            "updatedPatient====",
                            updatedPatient.consultant
                        );
                        const consultant = await userModel.findOne({
                            _id: updatedPatient.consultant,
                        });
                        await informConsultant(
                            consultant.name,
                            consultant.email,
                            "Re: Your UME Health Patient Referral",
                            finalReport
                        );
                        return successResponse(
                            res,
                            "Report submitted successfully",
                            updatedPatient,
                            200
                        );
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
}; */
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
                        const updatedPatient = await PatientRepo.updatePatient(
                            id,
                            {
                                finalReport,
                                adminResponse: true,
                                pending: false,
                            }
                        );

                        if (!updatedPatient) {
                            return badRequest(
                                res,
                                "Something went wrong, please try again",
                                []
                            );
                        }
                        console.log(
                            "updatedPatient====",
                            updatedPatient.consultant
                        );
                        const consultant = await userModel.findOne({
                            _id: updatedPatient.consultant,
                        });
                        // Pass the 'id' to the informConsultant function
                        await informConsultant(
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
                        );
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
    getAllPatients,
    createReferral,
    createPatient,
    getPatientById,
    updatePatient,
    deletePatient,
    patientUpdateRequest,
    patientProfile,
    uploadReportByAdmin,
};
