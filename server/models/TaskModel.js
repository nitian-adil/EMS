const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deadline: {
  type: Date,
  required: true,
},

    status: {
      type: String,
      enum: ["ASSIGNED", "ACCEPTED", "REJECTED", "COMPLETED"],
      default: "ASSIGNED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
