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
        enum: ['Male', 'Female', 'Prefer Not to Say'],
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
        default:""
    },
    postalCode: {
        type: String,
        default:""
    },
    city: {
        type: String,
        default:""
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
        enum: ['Self Provider', 'Insurance/Embassy'],
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
        enum: ['Yes', 'No', 'Not applicable', 'Unknown'],
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
