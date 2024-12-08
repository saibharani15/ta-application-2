require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine", "ejs");

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Global Middleware to Add Role to All Views
app.use((req, res, next) => {
  res.locals.role = req.cookies.role || null; // Attach `role` to all views
  next();
});

// Role-Based Access Control Middleware
function checkRole(requiredRole) {
  return (req, res, next) => {
    if (req.cookies.role !== requiredRole) {
      return res.status(403).send("Access Denied");
    }
    next();
  };
}

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/student", checkRole("student"), require("./routes/student"));
app.use("/staff", checkRole("staff"), require("./routes/staff"));
app.use("/instructor", checkRole("instructor"), require("./routes/instructor"));
app.use("/committee", checkRole("committee"), require("./routes/committee"));

// Default Route
app.get("/", (req, res) => res.redirect("/auth/login"));

// Logout Route
app.get("/logout", (req, res) => {
  res.clearCookie("userId");
  res.clearCookie("role");
  res.redirect("/auth/login");
});

// Redirect to Registration
app.get("/register", (req, res) => res.redirect("/auth/register"));

// Start Server
app.listen(3000, () => console.log("Server running at http://localhost:3000"));
