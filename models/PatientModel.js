const mongoose = require("mongoose");

const PatientModelName = "Patient";

const Schema = mongoose.Schema;

let Patient = new Schema(
    {
        address: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        clinicalInfo: {
            type: [String],
        },
        pdfURL: {
            type: String,
        },
        active: {
            type: Boolean,
            default: true,
        },
        adminResponse: {
            type: Boolean,
            default: false,
        },
        approved: {
            type: Boolean,
            default: false,
        },
        clinicalIndication: {
            type: String,
        },
        consultant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
            default: "",
        },
        firstName: {
            type: String,
        },
        gender: {
            type: String,
        },
        lastName: {
            type: String,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        metalImplant: {
            type: String,  // Add the missing field if it should be part of the schema
        },
        pregnancyStatus: {
            type: String,  // You can add this field if it is part of the schema
        },
        status: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
        },
        updateRequest: {
            type: Boolean,
            default: false,
        },
        updatedAt: {
            type: Date,
        },
        __v: {
            type: Number,
        },
        _id: {
            type: String,
        },
        // Add other fields as needed
    },
    {
        timestamps: true,
        collection: PatientModelName,
    }
);

module.exports = mongoose.model(PatientModelName, Patient);
