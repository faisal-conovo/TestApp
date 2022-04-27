const { verifyToken, decodeToken } = require("../utils/jwt");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let data;

    if (token && isCustomAuth) {
      data = verifyToken(token);
      req.userId = data?.id;
    } else {
      data = decodeToken(token);
      req.userId = data?.sub;
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
