const Role = require("./Modules/User/model");
const bcrypt = require("bcrypt");
const globalConstants = require("./utils/constants");
const { postUser } = require("./Modules/User/service");
const InterestsModel = require("./Modules/User/interestsModel");

exports.bootStrap = async () => {
  const DEFAULT_INTEREST = [
    {
      name: "Arts & Entertainment",
    },
    {
      name: "Auto & Vehicles",
    },
    {
      name: "Beauty & Fitness",
    },
    {
      name: "Books & Literature",
    },
    {
      name: "Business & Industry",
    },
    {
      name: "Computer & Electronics",
    },
    {
      name: "Finance",
    },
    {
      name: "Food & Drinks",
    },
    {
      name: "Hobbies & Leisure",
    },
    {
      name: "Home & Garden",
    },
    {
      name: "Internet & Telecom",
    },
    {
      name: "Jobs & Education",
    },
    {
      name: "Law & Government",
    },
    {
      name: "News",
    },
    {
      name: "Music",
    },
    {
      name: "Online Communities",
    },
    {
      name: "People & Society",
    },
    {
      name: "Pets & Animals",
    },
    {
      name: "Property",
    },

    {
      name: "Science",
    },
    {
      name: "Shopping",
    },
    {
      name: "Sports",
    },
    {
      name: "Travel",
    },
    {
      name: "Other",
    },
  ];
  // const role = await Role.findOne({ role: globalConstants.ADMIN_ROLE });
  const role = await Role.findOne({ email: "faisal.shahzad@conovoinc.com" });
  console.log("INSIDE BOOTSTRAP");
  if (!role) {
    const psd = "Abc@12345";
    const hashedPassword = await bcrypt.hash(psd, 12);
    const adminUser = await postUser({
      fullName: "Admin",
      userName: "Admin",
      email: "faisal.shahzad@conovoinc.com", 
      password: hashedPassword,
      user_type: "ADMIN",
      role: {
        label:"Super Admin" 
      }
    });
    await adminUser.save();
    const addInterests = await InterestsModel.create(DEFAULT_INTEREST);  
  }
};
