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
        eGFR: { type: String, },  // Adding eGFR field based on provided data
        metalImplant: { type: String, },
        eyeInjury: { type: String, },
        date: { type: Date, },
        // Ensure that the unique index is set in your MongoDB schema
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

/* 
let Referral = new Schema(
    {

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
); */

module.exports = mongoose.model(ReferralModelName, Referral); 
