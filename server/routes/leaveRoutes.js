// routes/leaveRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  applyLeave,
  approveLeave,
} = require("../controller/LeaveController");

const Leave = require("../models/LeaveModel");

/**
 * EMPLOYEE → Apply Leave
 */
router.post("/apply", auth, role("EMPLOYEE"), applyLeave);

/**
 * EMPLOYEE → View own leaves
 */
router.get("/my", auth, role("EMPLOYEE"), async (req, res) => {
  const leaves = await Leave.find({ employee: req.user._id });
  res.json(leaves);
});

/**
 * ADMIN / HR → View all leaves
 */
router.get("/", auth, role("ADMIN", "HR"), async (req, res) => {
  const leaves = await Leave.find().populate("employee", "name email");
  res.json(leaves);
});

/**
 * ADMIN / HR → Approve / Reject leave
 */
router.put("/:id", auth, role("ADMIN", "HR"), approveLeave);

module.exports = router;
