const mongoose = require("mongoose");
const PatientModelName = 'Patient';

const Schema = mongoose.Schema;

let Patient = new Schema({
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
        enum: ['Male', 'Female', 'Other'],
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
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
    bodyPart: {
        type: String,
        required: true,
    },
    clinicalIndication: {
        type: String,
        required: true,
    },
    payment: {
        type: String,
        required: true,
        enum: ['Self Provider', 'Third Party'],
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
      required: true,
    },
    safety: { 
      pacemaker: {
        type: String,
        enum: ['Yes', 'No'],
      },
      eyeInjury: {
        type: String,
        enum: ['Yes', 'No'],
      },
      pregnancy: {
        type: String,
        enum: ['Yes', 'No'],
      },
      eGFR: {
        type: String,
      }
    },
    pdfURL: {
        type: String,
        default: ''
    },
    active: {
        type: Boolean,
        default: true,
    },
    status : {
        type : Boolean,
        default: false
    },
    approved: {
        type: Boolean,
        default : false
    },
    updateRequest: {
        type: Boolean,
        default : false
    }
},
{ 
    timestamps: true,
    collection: PatientModelName,
});

module.exports = mongoose.model(PatientModelName, Patient);
