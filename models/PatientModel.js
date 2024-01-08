const mongoose = require("mongoose");
const PatientModelName = "Patient";

const Schema = mongoose.Schema;

let Patient = new Schema({
    active: { type: Boolean, },
    address: { type: String, },
    name: { type: String, },
    adminResponse: { type: Boolean, },
    approved: { type: Boolean, },
    city: { type: String, },
    clinicalIndication: { type: String, },
    clinicalInfo: { type: [String], },
    consultant: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultant', },
    createdAt: { type: Date, default: Date.now },
    dob: { type: Date, },
    email: { type: String, },
    eGFR: { type: String },  // Adding eGFR field based on provided data
    eyeInjury: { type: String, },  // Adding eyeInjury field based on provided data
    finalReport: { type: String, default: '' },
    firstName: { type: String, },
    gender: { type: String, },
    lastName: { type: String, },
    metalImplant: { type: String, },
    payment: { type: String, },
    pdfURL: { type: String, },
    pending: { type: Boolean, },
    phoneNumber: { type: String, },
    postalCode: { type: String, },
    status: { type: Boolean, },
    title: { type: String, },
    updateRequest: { type: Boolean, },
    updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model(PatientModelName, Patient);
