const Task = require("../models/TaskModel");

/**
 * ADMIN → Assign Task
 */
exports.assignTask = async (req, res) => {
  try {
    const { title, description, employeeId ,deadline} = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo: employeeId,
      assignedBy: req.user._id,
      deadline
    });

    res.status(201).json({
      message: "Task assigned successfully",
      task,
    });
  } catch (err) {
    
 res.status(500).json({ message: err.message });
  }
};

/**
 * EMPLOYEE → Get My Tasks
 */
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * EMPLOYEE → Update Task Status
 */
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id, action } = req.params;

    const statusMap = {
      accept: "ACCEPTED",
      reject: "REJECTED",
      complete: "COMPLETED",
    };

    if (!statusMap[action]) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const task = await Task.findOne({
      _id: id,
      assignedTo: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Rule: only ACCEPTED task can be completed
    if (action === "complete" && task.status !== "ACCEPTED") {
      return res
        .status(400)
        .json({ message: "Only accepted tasks can be completed" });
    }

    task.status = statusMap[action];

    if (action === "accept") task.acceptedAt = new Date();
    if (action === "reject") task.rejectedAt = new Date();
    if (action === "complete") task.completedAt = new Date();

    await task.save();

    res.json({
      message: `Task ${statusMap[action].toLowerCase()} successfully`,
      task,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// ACCEPT TASK
// EMPLOYEE → ACCEPT TASK
exports.acceptTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  task.status = "ACCEPTED";
  task.acceptedAt = new Date();
  await task.save();

  res.json({ message: "Task accepted", task });
};

// EMPLOYEE → REJECT TASK
exports.rejectTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  task.status = "REJECTED";
  task.rejectedAt = new Date();
  await task.save();

  res.json({ message: "Task rejected", task });
};

exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only accepted tasks can be completed
    if (task.status !== "ACCEPTED") {
      return res
        .status(400)
        .json({ message: "Only accepted tasks can be completed" });
    }

    task.status = "COMPLETED";
    task.completedAt = new Date();

    await task.save();

    res.json({
      message: "Task marked as completed",
      task,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



/**
 * ADMIN → Get all assigned tasks
 */
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email role")
      .populate("assignedBy", "name")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
