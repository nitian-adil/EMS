// controllers/payslipController.js
const Payslip = require("../models/PayslipModel");

exports.generatePayslip = async (req, res) => {
  const payslip = await Payslip.create({
    ...req.body,
    generatedBy: req.user._id
  });
  res.json(payslip);
};
