const PatientModel = require('../models/PatientModel');

/**
 * @returns {Array}
 */
const getAllPatients = async () => {
  return await PatientModel.find({active:true});
};

/**
 * @param {Object} patientData
 * @returns {PatientModel}
 */
const createPatient = async (patientData) => {
  return await PatientModel.create(patientData);
};

/**
 * @param {Object} filter
 * @returns {PatientModel}
 */
const findOnePatientByObject = async (filter) => {
  return await PatientModel.findOne(filter);
};

/**
 * @param {string} id - Patient ID
 * @param {Object} updatedData - Updated data for the patient
 * @returns {PatientModel}
 */
const updatePatient = async (id, updatedData) => {
  return await PatientModel.findOneAndUpdate({ _id: id }, { $set: updatedData }, { new: true });
};

/**
 * @param {string} id - Patient ID
 * @returns {boolean}
 */
const deletePatient = async (id) => {
  return await PatientModel.findOneAndUpdate({ _id: id}, {active : false}, {new:true });
};

module.exports = {
  getAllPatients,
  createPatient,
  findOnePatientByObject,
  updatePatient,
  deletePatient,
};
