/* eslint-disable quotes */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserModal = require("./model");
const InterestsModel = require("./interestsModel");
const { ALL_STATUS } = require("../../utils/status");

exports.checkUserByEmail = async (email) => {
  const result = await UserModal.findOne({
    email, 
  })
    .lean()
    .exec();
  return result;
};
exports.checkUserByUserName = async (userName) => { 
  const result = await UserModal.findOne({
    userName,
  });
  return result;
};
exports.getUserByEmail = async (email) => {
  const result = await UserModal.findOne({
    email,
  })
    .lean()
    .exec();
  return result;
};
exports.checkUserById = async (id) => {
  const result = await UserModal.findOne({
    _id: id,
  });
  return result;
};
exports.getUsers = async (start, end) => {
  let mylimit = end - start;
  const allUsers = await UserModal.find({ user_type: "USER" })

    .skip(start)
    .limit(mylimit)
    .lean()
    .exec();
  return allUsers;
};
exports.getTotal = async () => {
  const Total = await UserModal.estimatedDocumentCount({});
  return Total;
};
exports.getUserbyId = async (id) => {
  const user = await UserModal.findById(id).exec();
  return user;
};

exports.postUser = async (data) => {
  const userData = {
    ...data,
    status: ALL_STATUS.active,
  };
  try {
    const addUser = await UserModal.create(userData);
    console.log("hhhhhhhhhhhheeeeeeeeeeeeeeeeeeyyyyyyyyyyyyyyyyyyyyyyy",addUser)
    return addUser;
  } catch (error) {
    console.log(error);
    return error;
  }
};

exports.removeUser = async (id) => {
  const removedUser = await UserModal.findByIdAndRemove(id);
  return removedUser;
};

exports.updateUser = async (id, updatedUser) => {
  const updated = await UserModal.findByIdAndUpdate(id, updatedUser, {
    new: true,
  });
  return updated;
};
exports.getAdmin = async () => {
  const Admin = await UserModal.find({ user_type: "ADMIN" });
  return Admin;
};
exports.getInterests = async () => {
  // const allInterests = await InterestsModel.find().lean().exec();
  let allInterests = await InterestsModel.aggregate([
    { $project: { label: "$name", value: "$_id" } },
  ]);
  return allInterests;
};
exports.getClient = async () => {
  const Client = await UserModal.find({ user_type: "CLIENT" });
  return Client;
};
