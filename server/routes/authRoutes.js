const express = require("express");
const router = express.Router();
const {
  register,
  login
} = require("../controller/AuthController");

// Register Employee / HR / Admin
router.post("/register", register);

// Login
router.post("/login", login);

module.exports = router;
