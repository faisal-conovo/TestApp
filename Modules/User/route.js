/* eslint-disable quotes */
const CorsPlugin = require("fastify-cors");

const {
  // signup,
  login,
  getUser,
  getAllUsers,
  deleteUser,
  isUserEmailExist,
  updateAdminDetails,
  changePassword,
  webResetPassword,
  logout,
  addAdmin,
  getAllAdmin,
  getAllInterests,
  addClient,
  getAllClient,
  otpValidation,
  resetForgotPassword,
} = require("./controller");

async function routes(fastify) {
  // fastify.register(CorsPlugin, { origin: true });

  fastify.get("/", getAllUsers);
  fastify.post("/logout", logout);
  fastify.get("/:id", getUser);
  fastify.post("/email", isUserEmailExist);
  fastify.post("/reset-password", resetForgotPassword);
  fastify.delete("/delete", deleteUser);
  fastify.put("/updateUserDetails", updateAdminDetails);
  fastify.post("/changePassword", changePassword);
  fastify.post("/signin", login);
  fastify.post("/forgot-password", webResetPassword); 
  fastify.post("/", addAdmin); 
  fastify.get("/admin/", getAllAdmin);
  fastify.get("/getAllInterests" , getAllInterests);
  fastify.post("/addClient" , addClient);
  fastify.get("/getAllClient" , getAllClient);
  fastify.post("/otp-validation" , otpValidation);
}
module.exports = routes;
