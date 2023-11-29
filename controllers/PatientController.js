const PatientRepo = require('../repo/PatientRepo');
const { badRequest, successResponse, errorResponse } = require('../config/responceHandler');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});
/**
 * @returns {Array}
 */
const getAllPatients = async (req, res, next) => {
  try {
    const patients = await PatientRepo.getAllPatients();
    successResponse(res, 'Patients retrieved successfully.', patients, 200);
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
      cloudinary.uploader.upload_stream(
        { resource_type: 'raw', public_id: `patient_files/${patientData?.firstName + " " + patientData?.lastName}${Date.now()}.pdf` },
        async (error, result) => {
          if (error) {
            console.error(error);
            return next(error);
          }

          patientData.pdfURL = result.secure_url;

          try {
            const newPatient = await PatientRepo.createPatient(patientData);
            successResponse(res, 'Patient created successfully.', newPatient, 201);
          } catch (dbError) {
            next(dbError); 
          }
        }
      ).end(req.file.buffer);
    } else {
      try {
        const newPatient = await PatientRepo.createPatient(patientData);
        successResponse(res, 'Patient created successfully.', newPatient, 201);
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
      return badRequest(res, 'Patient not found.', []);
    }
    successResponse(res, 'Patient retrieved successfully.', patient, 200);
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
    const updatedData = req.body;
    console.log('updatedData', updatedData);
    if (req.file) {
      cloudinary.uploader.upload_stream(
        { resource_type: 'raw', public_id: `patient_files/${updatedData?.firstName + " " + updatedData?.lastName}${Date.now()}.pdf` },
        async (error, result) => {
          if (error) {
            console.error(error);
            return next(error);
          }

          updatedData.pdfURL = result.secure_url;

          try {
            const updatedPatient = await PatientRepo.updatePatient(id, updatedData);
            successResponse(res, 'Patient updated successfully.', updatedPatient, 200);
          } catch (dbError) {
            next(dbError); 
          }
        }
      ).end(req.file.buffer);
    } else {
      try {
        const updatedPatient = await PatientRepo.updatePatient(id, updatedData);
        successResponse(res, 'Patient updated successfully.', updatedPatient, 200);
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
      return badRequest(res, 'Patient not found.', []);
    }
    successResponse(res, 'Patient deleted successfully.', [], 200);
  } catch (error) {
    next(error);
  }
};


const patientUpdateRequest = async (req, res, next) =>{
  const {id, patientName} = req.body
  console.log('patient', patientName);
  try {
    const mailOptions = {
      from: 'sohailshabir282@gmail.com',
      to: "codezone67@gmail.com",
      subject: 'Request for Update',
      html: `
        <p>Dear Admin,</p>
        <p>We hope this message finds you well.</p>
        <p>We would like to request an update regarding referral of patient ${patientName}. Please provide any additional information or updates that may be relevant to your case.</p>
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
      auth : {
          user: process.env.USER,
          pass : process.env.PASSWORD
      }
  })

    const info = await transporter.sendMail(mailOptions);
    const updatedPatient = await PatientRepo.updatePatient(id, {updateRequest : true})
    return successResponse(res, 'Update Reminder Sent', updatedPatient , 200)
  }catch(error) {
    next(error)
  }
}
module.exports = {
  getAllPatients,
  createPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  patientUpdateRequest
};
