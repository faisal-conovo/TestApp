const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
      email: {
        type: String,
      },
})
const AuthUserModel = mongoose.model("authUser", userSchema);
module.exports = AuthUserModel;