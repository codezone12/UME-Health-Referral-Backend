const mongoose = require("mongoose");
const PatientModelName = 'Patient';

const Schema = mongoose.Schema;

let Patient = new Schema({
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
  active: {
    type : Boolean,
    default: false
  }
},
{ 
  timestamps: true,
  collection: PatientModelName,
});

module.exports = mongoose.model(PatientModelName, Patient);
