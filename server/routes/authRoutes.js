const express = require("express");
const router = express.Router();
const auth= require('../middleware/authMiddleware')
const role=require("../middleware/roleMiddleware")
const {
  register,
  login,
  fetchEmployees,
  deleteEmployee,
  fetchLoggedInUser
} = require("../controller/AuthController");
const { approveLeave } = require("../controller/LeaveController");

// Register Employee / HR / Admin
router.post("/register", register);

// Login
router.post("/login", login);
router.get("/fetchEmployees", fetchEmployees);
router.delete("/delete/:id", auth, role("ADMIN"), deleteEmployee);
router.get("/me",auth,fetchLoggedInUser )
router.patch("/:id/status", auth, role("ADMIN", "HR"), approveLeave);





module.exports = router;
