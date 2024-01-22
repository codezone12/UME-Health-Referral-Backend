const mongoose = require("mongoose");
const PatientModelName = "Patient";

const Schema = mongoose.Schema;

let Patient = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        dob: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female", "Prefer Not to Say"],
        },
        email: {
            type: String,
            required: true,
        },

        consultant: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
         referral: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        policyNumber:{
            type: String,
        },
        provider:{
            type: String,
        },
        address: {
            type: String,
            default: "",
        },
        postalCode: {
            type: String,
            default: "",
        },
        city: {
            type: String,
            default: "",
        },
        bodyPart: {
            type: String,
        },
        clinicalIndication: {
            type: String,
        },
        payment: {
            type: String,
            required: true,
            enum: ["Self Provider", "Insurance/Embassy"],
        },
        paymentMethod: {
            type: String,
        },
        provider: {
            type: String,
        },
        policyNumber: {
            type: String,
        },
        clinicalInfo: {
            type: [String],
        },
        eGFR: { type: String ,},  // Adding eGFR field based on provided data
    metalImplant: { type: String, },
        eyeInjury: { type: String, },
       date :{type: Date,},
        pdfURL: {
            type: String,
            default: "",
            unique:true,
        },
        active: {
            type: Boolean,
            default: true,
        },
        status: {
            type: Boolean,
            default: false,
        },
        approved: {
            type: Boolean,
            default: false,
        },
        pending: {
            type: Boolean,
            default: false,
        },
        updateRequest: {
            type: Boolean,
            default: false,
        },
        adminResponse: {
            type: Boolean,
            default: false,
        },
        finalReport: {
            type: String,
            default: "",
        },
        lastTimeMailSent: {
            type: Number,
        },
    },
    {
        timestamps: true,
        collection: PatientModelName,
    }
);

module.exports = mongoose.model(PatientModelName, Patient);
