const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  otp: { 
    type: String 
 },
  userId: {
    type: String,
  },
  genTime:{
    type: Number
  }
},{ 
  timestamps: true,
  
});

const OtpModel = mongoose.model("OtpModel", userSchema);
module.exports = OtpModel;
