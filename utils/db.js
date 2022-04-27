const mongoose = require("mongoose");
const env = require("../configs");

const startDatabase = async () => {
  try {
    await mongoose.connect(env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Server is connected");
  } catch (error) {
    console.log("There is some error connecting to database", error);
  }
};

module.exports = startDatabase;
