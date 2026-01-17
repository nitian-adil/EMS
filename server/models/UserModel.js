// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["EMPLOYEE", "HR", "ADMIN"],
      default: "EMPLOYEE",
    },
    department: String,
    designation: String,
    salary: {
      basic: Number,
      hra: Number,
      allowance: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
