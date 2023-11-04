const express = require("express");
const router = express.Router();
const userHandler = require("./handlers/users");

// Get all users data
router.get("/", userHandler.getAllUsers);
router.get("/", userHandler.createUser);

module.exports = router;
