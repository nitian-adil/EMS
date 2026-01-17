const express = require("express");
const router = express.Router();

const role = require("../middleware/roleMiddleware");
const auth=require("../middleware/authMiddleware")

const {
  generatePayslip
} = require("../controller/PaySlipController");
const Payslip = require("../models/PayslipModel");

/**
 * Admin generates payslip
 */
router.post(
  "/",
  auth,
  role("ADMIN"),
  generatePayslip
);

/**
 * Employee views own payslips
 */
router.get(
  "/my",
  auth,
  role("EMPLOYEE"),
  async (req, res) => {
    const payslips = await Payslip.find({ employee: req.user._id });
    res.json(payslips);
  }
);

/**
 * Admin views all payslips
 */
router.get(
  "/",
  auth,
  role("ADMIN"),
  async (req, res) => {
    const payslips = await Payslip.find()
      .populate("employee generatedBy", "name role");
    res.json(payslips);
  }
);

module.exports = router;
