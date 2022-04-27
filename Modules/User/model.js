const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  profile_image:Object,
  fullName: {
    type: String,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
  },
  company_name: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    label: String,
    value: String
  },
  spokes:Array,
  sector:Array,
  interest:Array,
  user_type: Array,
  // otp:{type: String},
  // otp:{ code:String, type: Date, expires: '2m', default: Date.now},
  email_verified:{type:Boolean,default:false},
}, {
  timestamps: true
});
 
const UserModal = mongoose.model("User", userSchema);
module.exports = UserModal;
  