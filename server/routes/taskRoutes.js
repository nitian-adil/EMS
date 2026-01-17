const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  assignTask,
  completeTask
} = require("../controller/TaskController");
const Task = require("../models/TaskModel");

/**
 * Admin assigns task
 */
router.post(
  "/",
  auth,
  role("ADMIN"),
  assignTask
);

/**
 * Employee views assigned tasks
 */
router.get(
  "/my",
  auth,
  role("EMPLOYEE"),
  async (req, res) => {
    const tasks = await Task.find({ assignedTo: req.user._id });
    res.json(tasks);
  }
);

/**
 * Admin views all tasks
 */
router.get(
  "/",
  auth,
  role("ADMIN"),
  async (req, res) => {
    const tasks = await Task.find()
      .populate("assignedTo assignedBy", "name role");
    res.json(tasks);
  }
);

/**
 * Employee marks task as completed
 */
router.put(
  "/:id/complete",
  auth,
  role("EMPLOYEE"),
  completeTask
);

module.exports = router;
