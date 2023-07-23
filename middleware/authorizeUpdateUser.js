const jwt = require("jsonwebtoken");
const util = require("util");
require("dotenv").config();

const asyncverify = util.promisify(jwt.verify);

const authorizeUpdateUser = async (req, res, next) => {
  try {
    const { authorization: token } = req.headers;
    console.log({ token });
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }

    const decoded = await asyncverify(token, process.env.JWT_PRIVATE_KEY);
    console.log({ decoded });
    if (decoded.isAdmin) {
      // If the user is an admin, they are authorized to update their data
      req.user = decoded;
      next();
    } else if (decoded._id === req.params.id) {
      // If the user is not an admin, but their ID matches the ID in the request parameters, they are authorized to update their data
      req.user = decoded;
      next();
    } else {
      // If the user is not an admin and their ID does not match the ID in the request parameters, they are not authorized to update their data
      res
        .status(403)
        .send(
          "Access denied. You are not authorized to update this user's data."
        );
      //print isAdmin
      console.log(decoded.isAdmin);
    }
  } catch (error) {
    console.error(error.message);
    if (error.name === "JsonWebTokenError") {
      res.status(400).send("Invalid token.");
    } else {
      res.status(500).send("Something went wrong.");
    }
  }
};

module.exports = authorizeUpdateUser;
