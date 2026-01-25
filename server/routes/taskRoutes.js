const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  assignTask,
  getMyTasks,
  updateTaskStatus,
  acceptTask,
  rejectTask,
  completeTask,
  getAllTasks

} = require("../controller/TaskController");

/**
 * ADMIN assigns task
 */
router.post("/assign",auth, role("ADMIN"), assignTask);
router.get("/", auth, role("ADMIN"), getAllTasks);

/**
 * EMPLOYEE gets assigned tasks
 */
router.get("/my", auth, role("EMPLOYEE"), getMyTasks);

/**
 * EMPLOYEE updates task status
 */
router.patch("/:id/:action", auth, role("EMPLOYEE"), updateTaskStatus);
router.patch("/tasks/:id/accept", auth, role("EMPLOYEE"), acceptTask);
router.patch("/tasks/:id/reject", auth, role("EMPLOYEE"), rejectTask);
router.patch("/tasks/:id/complete", auth, role("EMPLOYEE"), completeTask);

module.exports = router;
