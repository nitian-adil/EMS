// controllers/taskController.js
const Task = require("../models/TaskModel");

exports.assignTask = async (req, res) => {
  const task = await Task.create({
    ...req.body,
    assignedBy: req.user._id
  });
  res.json(task);
};

exports.completeTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status: "COMPLETED" },
    { new: true }
  );
  res.json(task);
};
