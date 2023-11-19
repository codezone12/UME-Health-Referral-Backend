const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let TokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  token: {
    type: String
  },
  email: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires : 3600 // 1 hour
  },  
  
},
{ 
  timestamps: true
});

module.exports = mongoose.model("Tokens", TokenSchema);
