const mongoose = require("mongoose");
const UserModelName = 'User'

const Schema = mongoose.Schema;

let User = new Schema({
  name: {
    type: String,
  },
  profileImage: {
    type: String,
    default: 'https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg'
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },  
  role: {
    type: String,
    default:"User"
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
