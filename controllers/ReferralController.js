/* const ReferralRepo = require("../repo/ReferralRepo"); */
const ReferralRepo = require("../repo/ReferralRepo");
/* const path = require("path");
const ReferralRepo = require(path.join(__dirname, "../repo/ReferralRepo")); */
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

        console.log(patientData);
        console.log("done");
        console.log(patientData.currentDate);
        let public_id;

        if (req.file) {
            if (patientData.currentDate) {
                // Format the currentDate string to a valid date format
                const currentDate = new Date(patientData.currentDate); 

                // Construct the formatted date string
                const formattedDate = `${day}-${month}-${year}`;
/*                  const formattedDate = currentDate.toISOString().split('T')[0]; // Extract YYYY-MM-DD  */

                // Construct the public_id using the formatted date
                public_id = `patient_files/${patientData.firstName} ${patientData.lastName}-${formattedDate(currentDate)}.pdf`;
            } else {
                public_id = `patient_files/${patientData.firstName} ${patientData.lastName}.pdf`;
            }

            // Upload the PDF file to Cloudinary
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",
                    public_id: public_id,
                },

                async (error, result) => {
                    if (error) {
                        console.error(error);
                        return next(error);
                    }

                    patientData.pdfURL = result.secure_url;

                    try {
                        const newPatient = await ReferralRepo.createReferral(patientData);
                        const admin = await UserModel.findOne({ role: "Admin" });
                        const name = `${patientData.title} ${patientData.firstName} ${patientData.lastName}`;

                        await referralConfirmation(
                            admin.name,
                            admin.email,
                            "A new UME Health referral has been created",
                            patientData.pdfURL
                        );

                        await referralConfirm(
                            name,
                            patientData.email,
                            "A new UME Health referral has been created",
                            patientData.pdfURL
                        );

                        await referralConfirmed(
                            patientData.secretaryName,
                            patientData.secretaryEmail,
                            "A new UME Health referral has been created",
                            patientData.pdfURL
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
            ).end(req.file.buffer);
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




/* const createReferral = async (req, res, next) => {
    try {
        const patientData = req.body;

        console.log(patientData)
        console.log("done")

        if (req.file) {
            if (patientData.date) {

                const [year, month, day] = patientData.date.split('-');

                // Construct the formatted date string
                const formattedDate = `${day}-${month}-${year}`;

                // Construct the public_id using the formatted date
                const public_id = `patient_files/${patientData.firstName} ${patientData.lastName}-${formattedDate}.pdf`;
            } else {
                const public_id = `patient_files/${patientData.firstName} ${patientData.lastName}-${patientData.date}.pdf`;

            }
            // Upload the PDF file to Cloudinary
            cloudinary.uploader
                .upload_stream(
                    {
                        resource_type: "raw",
                        public_id: public_id,
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
                            const admin = await UserModel.findOne({ role: "Admin" })
                            const name = `${patientData.title} ${patientData.firstName} ${patientData.lastName}`;

                            await referralConfirmation(
                                admin.name,
                                admin.email,
                                "A new UME Health referral has been created",
                                patientData.pdfURL
                            );

                            await referralConfirm(
                                name,
                                patientData.email,
                                "A new UME Health referral has been created",
                                patientData.pdfURL
                            );
                            await referralConfirmed(

                                patientData.secretaryName,
                                patientData.secretaryEmail,
                                "A new UME Health referral has been created",
                                patientData.pdfURL
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
                ).end(req.file.buffer);
        } else {
            try {
                const newPatient = await ReferralRepo.createReferral(patientData);


                successResponse(
                    res,
                    "Referraal created successfully",
                    newPatient,
                    201
                )

            } catch (dbError) {
                next(dbError);
            }
        }
    } catch (error) {
        next(error);
    }

}; */




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
 * 
 */

/* const updateReferral = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const consultant = await UserModel.findById(data.consultant);

        if (req.file) {
            // Handle file upload to Cloudinary
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
                        const updatedReferral = await ReferralRepo.updateReferralById(id, data);
                        successResponse(res, "Referral updated successfully", updatedReferral, 200);
} catch (dbError) {
                        next(dbError);
                    }
                }
            ).end(req.file.buffer);
        } else {
            try {
                const updatedReferral = await ReferralRepo.updateReferralById(id, data);
                const referral = await referralModel.findOne({ _id: id });
                const admin = await UserModel.findOne({ role: "Admin" });

                const name = `${referral.title} ${referral.firstName} ${referral.lastName}`;
                console.log("dadrta:", updatedReferral)
                console.log("name;", name)
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
                    updatedReferral.pdfURL
                );

                await referralConfirmed(

                    consultant.name,
                    consultant.email,
                    "A new UME Health referral has been created",
                    updatedReferral.pdfURL
                );

                successResponse(res, "Profile updated successfully", updatedReferral, 200);
            } catch (dbError) {
                console.log("errrr")
                next(dbError);
            }
        }
    } catch (error) {
        next(error);
    }
}; */





/**
 * @param {Object} req.params - Patient ID
 * @param {Object} req.body - Updated patient data
 * @returns {PatientModel}
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
                        const updatedReferral = await ReferralRepo.updateReferralById(id, data);
                        successResponse(res, "Referral updated successfully", updatedReferral, 200);
                    } catch (dbError) {
                        next(dbError);
                    }
                }
            ).end(req.file.buffer);
        } else {
            try {
                const updatedPatient = await ReferralRepo.updateReferralById(id, data);
                const patient = await referralModel.findOne({ _id: id });
                const admin = await UserModel.findOne({ role: "Admin" });

                const name = `${patient.title} ${patient.firstName} ${patient.lastName}`;
                console.log("name", name)
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

                successResponse(res, "Referral updated successfully", updatedPatient, 200);
            } catch (dbError) {
                next(dbError);
            }
        }
    } catch (error) {
        next(error);
    }
};

/* const updateReferral = async (req, res, next) => {
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
                        const updatedReferral = await ReferralRepo.updateReferral(id, data);
                        successResponse(res, "Patient updated successfully", updatedReferral, 200);
                    } catch (dbError) {
                        next(dbError);
                    }
                }
            ).end(req.file.buffer);
        } else {
            try {
                const updatedReferral = await ReferralRepo.updateReferral(id, data);
                const referral = await referralModel.findOne({ _id: id });
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
                    referral.email,
                    "A new UME Health referral has been created",
                    updatedReferral.pdfURL
                );

                await referralConfirmed(

                    consultant.name,
                    consultant.email,
                    "A new UME Health referral has been created",
                    updatedReferral.pdfURL
                );

                successResponse(res, "Profile updated successfully", updatedReferral, 200);
            } catch (dbError) {
                next(dbError);
            }
        }
    } catch (error) {
        next(error);
    }
}; */
/* const updateReferral = async (req, res, next) => {
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
                        const updatedReferral = await ReferralRepo.updateReferral(id, data);
                        successResponse(res, "Referral updated successfully", updateReferral, 200);
                    } catch (dbError) {
                        next(dbError);
                    }
                }
            ).end(req.file.buffer);
        } else {
            try {
                const updatedReferral = await ReferralRepo.updateReferral(id, data);
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
                    updatedReferral.pdfURL
                );

                await referralConfirmed(

                    consultant.name,
                    consultant.email,
                    "A new UME Health referral has been created",
                    updatedReferral.pdfURL
                );

                successResponse(res, "Profile updated successfully", updateReferral, 200);
            } catch (dbError) {
                next(dbError);
            }
        }
    } catch (error) {
        next(error);
    }
}; */
const referralUpdateRequest = async (req, res, next) => {
    console.log("ReferralUpdateRequest");
    const { pdfURL, id, name, patientName: originalPatientName } = req.body;
    console.log("referral", originalPatientName, name);

    try {
        const referral = await referralModel.findOne({ _id: id });
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
        const updatedReferral = await PatientRepo.updateReferral(id, {
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
            await referralModel.findOneAndUpdate(
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
                        const updatedReferral = await ReferralRepo.updateReferralById(
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
    referralUpdateRequest,
    deleteReferral,
    newReferral,
    uploadReportByAdmin


};
