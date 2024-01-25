const mongoose = require("mongoose");
const ReferralModelName = "Referral";

const Schema = mongoose.Schema;

let Referral = new Schema(
    {


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
