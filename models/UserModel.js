const mongoose = require("mongoose");
const UserModelName = 'User'

const Schema = mongoose.Schema;

let User = new Schema({
  name: {
    type: String,
  },
  image: {
    type: String,
    default: 'https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg'
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },  
  practitionerSpecialty : {
    type: String,
    default: ""
  },
  practitionerGroup : {
    type: String,
    default: ""
  },
  primaryPracticeName : {
    type: String,
    default: ""
  },
  registrationNumber : {
    type: String,
    default: ""
  },
  street : {
    type: String,
    default: ""
  },
  jobTitle : {
    type: String,
    default: ""
  },
  postcode : {
    type: String,
    default: ""
  },
  landline : {
    type: String,
    default: ""
  },
  townCity : {
    type: String,
    default: ""
  },
  role: {
    type: String,
    default:"consultant"
  },
  active: {
    type: Boolean,
    default: true
  },
  verified: {
    type: Boolean,
    default: false
  }
},
{ 
  timestamps: true,
  collection: UserModelName 
});

module.exports = mongoose.model(UserModelName, User);
