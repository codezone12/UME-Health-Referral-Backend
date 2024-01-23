const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    active: {
        type: Boolean,
        default: true,
    },
    address: {
        type: String,
        required: true,
    },
    adminResponse: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: false,
    },
    city: {
        type: String,
        required: true,
    },
    clinicalIndication: {
        type: String,
    },
    clinicalInfo: {
        type: [String],
    },
    consultant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming there is a User model
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    date: {
        type: Date,
    },
    dob: {
        type: Date,
    },
    eGFR: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    eyeInjury: {
        type: String,
    },
    finalReport: {
        type: String,
    },
    firstName: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Prefer Not to Say"],
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    metalImplant: {
        type: String,
    },
    payment: {
        type: String,
        enum: ["Insurance/Embassy"],
        required: true,
    },
    pdfURL: {
        type: String,
    },
    pending: {
        type: Boolean,
        default: false,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    policyNumber: {
        type: String,
    },
    postalCode: {
        type: String,
    },
    provider: {
        type: String,
    },
    status: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        required: true,
    },
    updateRequest: {
        type: Boolean,
        default: false,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
