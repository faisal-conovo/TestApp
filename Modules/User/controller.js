/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
const bcrypt = require("bcrypt");
const mailgun = require("mailgun-js");
const { CLIENT_URL } = require("../../configs/production");
const { createToken } = require("../../utils/jwt");
const { getRandomNumber } = require("../../utils");
const { NodeMailer } = require("../../utils/nodemailer");
// const { uploadFile } = require("./s3");
const UserModal = require("./model");
const authUserModel = require("./userAuthModel");
const otpModel = require("./otpModel");
const {
  checkUserById,
  checkUserByEmail,
  getUserbyId,
  getUsers,
  postUser,
  removeUser,
  updateUser,
  getTotal,
  getAdmin,
  getInterests,
  getClient,
} = require("./service");
exports.getAllUsers = async (request, responce) => {
  let start = parseInt(request.query._start, 10);
  let end = parseInt(request.query._end, 10);
  let allUsers = await getUsers(start, end);
  allUsers = allUsers.map((user, index) => ({
    ...user,
    id: user._id,
  }));
  //
  let total = await getTotal();
  responce.header("Access-Control-Expose-Headers", "X-Total-Count");
  responce.header("X-Total-Count", total);
  return responce.status(200).send({ data: allUsers, status: true });
};

exports.isUserEmailExist = async (request, responce) => {
  const { email } = request.body;
  try {
    const user = await checkUserByEmail(email);
    if (user) return responce.status(200).send("email already exist");
    return responce.status(201).send(false);
  } catch (error) {
    return responce.status(500).send({ error });
  }
};
// Logout
exports.logout = async (request, responce) => {
  try {
    const user = await checkUserByEmail(request.body.email);
    if (!user) {
      return responce.status(200).send({
        payload: null,
        message: "user not found",
        status: false,
      });
    } else {
      let result = await authUserModel.deleteOne({ email: request.body.email });
      responce
        .status(200)
        .send({ message: "logout successfully", status: true });
    }
  } catch (e) {
    console.log("e", e);
    responce.status(500).send(e);
  }
};
// Get all Interests
exports.getAllInterests = async (request, responce) => {
  let allInterests = await getInterests();
  // allInterests = allInterests.map((interest) => ({
  //   ...interest,
  // }));
  return responce.status(200).send({ data: allInterests, status: true });
};
// Add user as Admin
exports.addAdmin = async (request, responce) => {
  const { email, userName } = request.body;
  try {
    const user = await checkUserByEmail(email);
    if (user)
      return responce.status(200).send({
        message: "email already exist",
        status: false,
      });
  } catch (error) {
    return responce.status(500).send({ error });
  }
  const psd = request.body.password;
  const hashedPassword = await bcrypt.hash(psd, 12);
  const { role, user_type } = request.body;
  postadminUser = {
    userName,
    email,
    role,
    user_type,
    password: hashedPassword,
  };
  const user = await postUser(postadminUser);
  
  return responce
    .status(201)
    .send({ status: true, message: "User Added Successfully" });
};
exports.getAllAdmin = async (request, responce) => {
  try {
    const Admin = await getAdmin();
    return responce.status(200).send({ data: Admin, status: true });
  } catch (error) {
    return responce.status(404).send({ msg: error, status: false });
  }
};
// delete user by ID
exports.deleteUser = async (request, responce) => {
  const { id } = request.body;
  const del = await checkUserById(id);
  if (!del)
    return responce
      .status(404)
      .send({ message: "User does not exist ", status: false });
  await removeUser(id);
  return responce.send({ status: true, message: "User Deleted Successfully" });
};
// Add Client
exports.addClient = async (request, responce) => {
  const { email, userName } = request.body;
  try {
    const user = await checkUserByEmail(email);
    if (user)
      return responce.status(200).send({
        message: "email already exist",
        status: false,
      });
  } catch (error) {
    return responce.status(500).send({ message: error, status: false });
  }
  const psd = request.body.password;
  const hashedPassword = await bcrypt.hash(psd, 12);
  const { role, user_type, company_name, sector, spokes, profile_image } =
    request.body;
  newUser = {
    role,
    user_type,
    company_name,
    sector,
    spokes,
    profile_image,
    email,
    userName,
    password: hashedPassword,
  };
  const user = await postUser(newUser);
  if (user){
  return responce
    .status(201)
    .send({ status: true, message: "User Added Successfully" });
  }
};
// Get All Clients
exports.getAllClient = async (request, responce) => {
  try {
    const Client = await getClient();
    return responce.status(200).send({ data: Client, status: true });
  } catch (error) {
    return responce.status(404).send({ message: error, status: false });
  }
};
// Forgot Password
exports.webResetPassword = async (request, responce) => {
  const { email } = request.body;
  // try {
  const user = await checkUserByEmail(email);
  if (!user)
    return responce
      .status(200)
      .send({ message: "User Not Found", status: false });
  const otp = getRandomNumber();
  const mailOptions = {
    from: "faisal.shahzad@conovoinc.com",
    to: email,
    subject: "Test App",
    html: `<h2>Forgot your password?</h2>
    <p>Don't worry, simply go back to your browser and enter the access token below. You'll then be able to reset your password to something more memorable.</p>
<h1>Please click the below link to reset password</h1>
<p>If you've not requested a password reset, just ignore this email and your current password will still work</p>
    <a href="http://localhost:3000/reset-password/${user._id}/${otp}">Reset Password</a>`,
  };
  NodeMailer(mailOptions);
  // let updated = await UserModal.updateOne(
  //   { _id: user._id },
  //   {
  //     $set: {
  //       otp,
  //     },
  //   }
  // );
  // const saveOtp = await otpModel.create({otp : otp , userId: user._id});
  try {
    const time = new Date().getTime() + 300*1000
    const saveOtp = await otpModel.findOneAndUpdate(
      {
        userId: user._id,
      },
      {
        genTime: time,
        $set: {
          otp: otp ,
        },
      }, 
      {upsert: true}
    );
// console.log("cheeeeeeeeeeeeeecccccccccccckkkkkkkk", saveOtp) 
    if (saveOtp) {
      return responce
        .status(200)
        .send({ status: true, message: "Email send successfully" });
    }
    if (!saveOtp)
    return responce.status(500).send({ status: false, message: "Error Occured" });
  } catch (error) {
    console.log(error)
    return responce.status(500).send({ status: false, message: error });
  }
};
// Otp Verification
exports.otpValidation = async (request, responce) => {
  const { email, otp } = request.body;
  try {
    let user = await checkUserById(email);
    if (!user)
      return responce.status(200).send({
        payload: null,
        message: "User does not exist",
        status: false,
      });
    // let verifyOtp = await UserModal.findOne({ _id: email, otp: otp });
    let verifyOtp = await otpModel.findOne({ userId: email, otp: otp });
    
    if (verifyOtp){
      let currentTime = new Date().getTime();
      let diff = verifyOtp.genTime - currentTime;
      console.log( diff)
      if(diff < 0){
        await otpModel.deleteOne({ _id : verifyOtp._id });
        return responce.status(200).send({
          message: "OTP Expired",
          status: false,
        });
      }
    }
    if (!verifyOtp)
      return responce.status(200).send({
        message: "Invalid OTP",
        status: false,
      });
      await otpModel.deleteOne({ _id : verifyOtp._id });
    return responce.status(200).send({
      status: true,
      message: "OTP Verified Successfully",
      data: "Validated",
    });
  } catch (error) {
    return responce.status(500).send({ message: error, status: false });
  }
};   
// Reset Password
exports.resetForgotPassword = async (request, responce) => {
  try {
    const { user, password } = request.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const updatePassword = await UserModal.updateOne(
      { _id: user },
      { $set: { password: hashedPassword } } 
    );
    if (updatePassword) {
      return responce
        .status(200)
        .send({ message: "Password Reset Successfully", status: true });
    }
  } catch (error) {
    return responce.status(500).send({ message: error, status: false });
  }
};
// Get User by Id
exports.getUser = async (request, responce) => {
  const { id } = request.params;
  console.log(id);
  try {
    const user = await getUserbyId(id);
    if (!user) {
      return responce
        .status(401)
        .send({ message: "User not found", status: false });
    }
    return responce.status(200).send({ data: user, status: true });
  } catch (error) {
    return responce.status(404).send({ message: error, status: false });
  }
};
// update user by ID
exports.updateAdminDetails = async (request, responce) => {
  try {
    const { id } = request.body;
    const { userName, email, role } = request.body.data;
    const user = { userName, email, role };
    const update = await updateUser(id, user);
    return responce.status(200).send({
      data: update,
      message: "User Updated Succesfully",
      status: true,
    });
  } catch (error) {
    return responce.status(500).send({ message: error, status: false });
  }
};
// Change Password
exports.changePassword = async (request, responce) => {
  const { old_password, password, id } = request.body;
  try {
    const user = await checkUserById(id);
    if (!user)
      return responce
        .status(404)
        .send({ status: false, message: "Invalid User" });
    const isPasswordCorrect = await bcrypt.compare(old_password, user.password);
    // if (!(await checkUserById(id))) return responce.status(404).send(false);
    if (!isPasswordCorrect) {
      return responce
        .status(404)
        .send({ status: false, message: "Current password is invalid" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const updatePassword = {
      password: hashedPassword,
      _id: id,
    };
    await updateUser(id, updatePassword);
    return responce
      .status(200)
      .send({ status: true, message: "Password changed Successfully" });
  } catch (error) {
    return responce.status(500).send({ status: false, message: error });
  }
};
// Login
exports.login = async (request, responce) => {
  const { email, password } = request.body;
  try {
    let user = await checkUserByEmail(email);
    if (!user)
      return responce.status(200).send({
        payload: null,
        token: null,
        message: "Email does not exist",
        status: false,
      });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return responce.status(200).send({
        payload: null,
        token: null,
        message: "Invalid Credentials",
        status: false,
      });
    const data = { email: email };
    const addUser = await authUserModel.create(data);
    const token = createToken(user);
    return responce.status(200).send({
      payload: user,
      status: true,
      token,
    });
  } catch (error) {
    return responce.status(500).send({ message: error, status: false });
  }
};
