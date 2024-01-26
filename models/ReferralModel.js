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
         patient: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
        }, 
        consultant: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        bodyPart: {
            type: String,
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
            default: "null",
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

module.exports = mongoose.model(ReferralModelName, Referral);
