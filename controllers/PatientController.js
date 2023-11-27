const PatientRepo = require('../repo/PatientRepo');
const { badRequest, successResponse, errorResponse } = require('../config/responceHandler');
const cloudinary = require('cloudinary').v2;

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

    // To make the controller flexible, update only the provided fields
    const allowedFields = ['title', 'firstName', 'lastName', 'dob', 'gender', 'email', 'phoneNumber', 'address', 'postalCode', 'city', 'bodyPart', 'clinicalIndication', 'payment', 'paymentMethod', 'clinicalInfo', 'safety'];
    const filteredData = {};
    
    Object.keys(updatedData).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updatedData[key];
      }
    });

    const updatedPatient = await PatientRepo.updatePatient(id, filteredData);
    successResponse(res, 'Patient updated successfully.', updatedPatient, 200);
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

module.exports = {
  getAllPatients,
  createPatient,
  getPatientById,
  updatePatient,
  deletePatient,
};
