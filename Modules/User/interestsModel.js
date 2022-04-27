const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:String,
},{
    timestamps: true
})
const InterestsModel = mongoose.model("InterestsModel", userSchema);
module.exports = InterestsModel;