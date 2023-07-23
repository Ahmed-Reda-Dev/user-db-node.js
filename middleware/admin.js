const jwt = require("jsonwebtoken");
const util = require("util");
const asyncverify = util.promisify(jwt.verify);
require("dotenv").config();

const AdminAuthorized = async (req, res, next) => {
  const { authorization: token } = req.headers;
  console.log(token);
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = await asyncverify(token, process.env.JWT_PRIVATE_KEY);
    if (verified.isAdmin) next();
    else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    console.error(err);
    res.status(400).send("Invalid Token: " + err.message);
  }
};

const canDeleteUser = async (req, res, next) => {
  const { authorization: token } = req.headers;
  console.log(token);
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = await asyncverify(token, process.env.JWT_PRIVATE_KEY);
    if (verified.isAdmin) next();
    else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    console.error(err);
    res.status(400).send("Invalid Token: " + err.message);
  }
};

module.exports = { AdminAuthorized, canDeleteUser };
