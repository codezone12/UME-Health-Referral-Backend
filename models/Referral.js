/* const mongoose = require("mongoose");
const ReferralModelName = "Referral";

const Schema = mongoose.Schema;

let Referral = new Schema(
    {
        bodyPart: {
            type: String,
        },
        clinicalIndication: {
            type: String,
        },
        patient: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
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
            unique: true,
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

module.exports = mongoose.model(ReferralModelName, Referral); */
