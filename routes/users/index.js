const express = require("express");
const {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("./users.controller");
const { validateUser } = require("../../middleware/validation");
const { AdminAuthorized, canDeleteUser } = require("../../middleware/admin");
const authorizeUpdateUser = require("../../middleware/authorizeUpdateUser");

const router = express.Router();

// Route for creating a new user.
router.post("/signup", validateUser, createUser);

// Route for logging in a user.
router.post("/login", loginUser);

// Route for getting all users.
router.get("/", AdminAuthorized, getUsers);

// Route for getting a user by ID.
router.get("/:id", AdminAuthorized, getUserById);

// Route for updating a user by ID.
router.put("/:id", authorizeUpdateUser, validateUser, updateUserById);

// Route for deleting a user by ID.
router.delete("/:id", canDeleteUser, deleteUserById);

module.exports = router;
