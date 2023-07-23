const mongoose = require("mongoose");
require("dotenv").config();

/**
 * Connects to a MongoDB database using Mongoose.
 */
async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (ex) {
    console.error("Could not connect to MongoDB", ex);
    throw ex;
  }
}

module.exports = { connect };
