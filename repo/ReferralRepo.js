const ReferralModel = require('../models/ReferralModel');

/**
 * @returns {Array}
 */
const getAllPatients = async () => {
    return await PatientModel.find({ active: true }).populate([{ path: "consultant" }]);
};

/**
 * @param {Object} patientData
 * @returns {PatientModel}
 */
const createReferral = async (patientData) => {
    return await ReferralModel.create(patientData);
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
    return await PatientModel.findOneAndUpdate({ _id: id }, { active: false }, { new: true });
};

module.exports = {
    getAllPatients,
    createReferral,
    findOnePatientByObject,
    updatePatient,
    deletePatient,
};
