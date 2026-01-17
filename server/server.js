const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Connect MongoDB
connectDB();

// Initialize app
const app = express();


// Middlewares
app.use(cors());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Routes'[{'}]
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/leaves", require("./routes/leaveRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/payslips", require("./routes/payslipRoutes"));

// Root route
app.get("/", (req, res) => {
  res.send("Employee Management System API is running 🚀");
});

// Global error handler (basic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
