// models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED"],
      default: "PENDING",
    },
    dueDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
