const PatientRepo = require('../repo/PatientRepo');
const { badRequest, successResponse, errorResponse } = require('../config/responceHandler');

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
    const newPatient = await PatientRepo.createPatient(patientData);
    successResponse(res, 'Patient created successfully.', newPatient, 201);
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
    const updatedPatient = await PatientRepo.updatePatient(id, updatedData);
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
