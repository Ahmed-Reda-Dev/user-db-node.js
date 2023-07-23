const express = require("express");
const { connect } = require("./db");
const usersRouter = require("./routes/users");
const cors = require("cors");
const config = require("config");

const app = express();
app.use(express.json());

// Connect to the database
connect();

//cors
app.use(cors());

// Use the users router for handling user-related requests
app.use("/api/users", usersRouter);

// Define error handling middleware function
function errorHandler(err, req, res, next) {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => error.message);
    return res
      .status(400)
      .json({ message: `Validation error: ${errors.join(", ")}` });
  }

  if (err.name === "MongoError" && err.code === 11000) {
    return res.status(400).json({ message: "Email already exists." });
  }

  res.status(500).json({ message: "Internal server error." });
}

// Add error handling middleware function to the app
app.use(errorHandler);

// Start listening on the specified port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
