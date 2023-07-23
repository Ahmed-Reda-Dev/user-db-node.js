const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");
const asyncsign = util.promisify(jwt.sign);
const lodash = require("lodash");
require("dotenv").config();

/**
 * Mongoose schema for User model
 */
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
//use lodash to hide password and __v
userSchema.methods.toJSON = function () {
  const user = this;
  return lodash.omit(user.toObject(), ["password", "__v"]);
};

// Hash the password before saving the user model
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

// Generate an auth token for the user
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = await asyncsign(
    { _id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

module.exports = { userSchema };
