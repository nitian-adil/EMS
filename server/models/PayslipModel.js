// models/Payslip.js
const mongoose = require("mongoose");

const payslipSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    month: String,
    year: Number,
    basicSalary: Number,
    hra: Number,
    allowance: Number,
    deductions: Number,
    netSalary: Number,
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payslip", payslipSchema);
