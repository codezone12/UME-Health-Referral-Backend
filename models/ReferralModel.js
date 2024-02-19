const mongoose = require("mongoose");
const ReferralModelName = "Referral";
const Schema = mongoose.Schema;

let Referral = new Schema(
    {
        title: {
            type: String,

        },
        firstName: {
            type: String,

        },
        lastName: {
            type: String,

        },
        secretaryName: {
            type: String,
        },
        secretaryTelephone: {
            type: String,
        },
        secretaryEmail: {
            type: String,
        },
        dob: {
            type: Date,

        },
        date: {
            type: Date,
            required: true
        },
        currentDate: {
            type: Date,

        },
        appoinmentDate: {
            type: String,
            default: "",


        },
        time: {
            type: String,
            default: "",
        },
        gender: {
            type: String,

        },
        phoneNumber: {
            type: String,
        },
        /*  policyNumber: {
             type: String,
         }, */
        provider: {
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
        payment: {
            type: String,
            enum: ["Self Provider", "Insurance/Embassy"],
        },
        paymentMethod: {
            type: String,
        },
        /*  provider: {
             type: String,
         }, */
        policyNumber: {
            type: String,
        },
        patient: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
        },
        email: {
            type: String,
        },
        consultant: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        mobility: {
            type: String,
            enum: ["Mobile", "Non-Mobile"],
        },
        pregnancyStatus: {
            type: String,
            enum: ["Yes", "No", "Not applicable", "Unknown"],
        },

        bodyPart: {
            type: String,
        },
        rf: {
            type: Boolean,
            default: false,
        },
        clinicalIndication: {
            type: String,
        },
        clinicalInfo: {
            type: [String],
        },
        eGFR: { type: String },
        metalImplant: { type: String },
        eyeInjury: { type: String },
        date: { type: Date },
        pdfURL: {
            type: String,
            default: "",
            /*  unique: true, */
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
        collection: ReferralModelName,
    }
);

module.exports = mongoose.model(ReferralModelName, Referral);
