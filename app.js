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
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/student", require("./routes/student"));
app.use("/staff", require("./routes/staff"));
app.use("/instructor", require("./routes/instructor"));
app.use("/committee", require("./routes/committee"));

// Default Route
app.get("/", (req, res) => res.redirect("/auth/login"));

// Logout
app.get("/logout", (req, res) => {
  res.clearCookie("userId");
  res.clearCookie("role");
  res.redirect("/auth/login");
});

app.get("/Register", (req, res) => res.redirect("/auth/Register"));

// Start Server
app.listen(3000, () => console.log("Server running at http://localhost:3000"));
