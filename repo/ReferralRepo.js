const ReferralModel = require('../models/ReferralModel');

/**
 * @returns {Array}
 */
const getAllReferrals = async () => {
    return await ReferralModel.find({ active: true }).populate([{ path: "consultant" }]);
};

/**
 * @param {Object} patientData
 * @returns {ReferralModel}
 */
const createReferral = async (patientData) => {
    return await ReferralModel.create(patientData);
};
const Referral = async (patientData) => {
    return await ReferralModel.create(patientData);
};

/**
 * @param {Object} filter
 * @returns {ReferralModel}
 */
const findOneReferralByObject = async (filter) => {
    return await ReferralModel.findOne(filter);
};

/**
 * @param {string} id - Patient ID
 * @param {Object} updatedData - Updated data for the patient
 * @returns {ReferralModel}
 */
const updateReferral = async (id, updatedData) => {
    return await ReferralModel.findOneAndUpdate({ _id: id }, { $set: updatedData }, { new: true });
};

/**
 * @param {string} id - Patient ID
 * @returns {boolean}
 */
const deleteReferral = async (id) => {
    return await ReferralModel.findOneAndUpdate({ _id: id }, { active: false }, { new: true });
};

module.exports = {
    getAllReferrals,
    createReferral,
    findOneReferralByObject,
    updateReferral,
    deleteReferral,
    Referral,
};
