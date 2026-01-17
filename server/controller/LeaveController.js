// controllers/leaveController.js
const Leave = require("../models/LeaveModel");

/**
 * EMPLOYEE → Apply Leave
 */
exports.applyLeave = async (req, res) => {
  try {
    const leave = await Leave.create({
      employee: req.user._id,
      ...req.body,
      status: "PENDING",
    });

    res.status(201).json({
      message: "Leave applied successfully",
      leave,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ADMIN / HR → Approve or Reject Leave
 */
exports.approveLeave = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status,
        approvedBy: req.user._id,
      },
      { new: true }
    ).populate("employee", "name email");

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.json({
      message: `Leave ${status.toLowerCase()} successfully`,
      leave,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
