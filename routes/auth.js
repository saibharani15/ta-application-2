const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Render Login Page
router.get("/login", (req, res) => {
  res.render("login", { role: req.cookies.role || null, error: null });
});

// Handle Login Submission
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username and password (ensure passwords are hashed in production)
    const user = await User.findOne({ username, password });

    if (user) {
      // Set cookies for userId and role
      res.cookie("userId", user._id);
      res.cookie("role", user.role);

      // Redirect to the appropriate dashboard
      res.redirect(`/${user.role}/dashboard`);
    } else {
      // User not found or incorrect credentials
      res.render("login", {
        role: req.cookies.role || null,
        error: "Invalid username or password. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error.");
  }
});

// Render Registration Page
router.get("/register", (req, res) => {
  res.render("register", { error: null }); // Pass an error object for feedback if needed
});

// Handle Registration Submission
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Ensure required fields are provided
    if (!username || !email || !password || !role) {
      return res.status(400).render("register", {
        error: "All fields are required.",
      });
    }

    // Attempt to create a new user
    await User.create({ username, email, password, role });

    // Redirect to login on successful registration
    res.redirect("/auth/login");
  } catch (error) {
    console.error("Error during registration:", error);

    // Handle unique email error
    if (error.code === 11000 && error.keyPattern.email) {
      res.status(400).render("register", {
        error: "Email is already registered.",
      });
    } else {
      res.status(500).send("Server Error: Unable to register user.");
    }
  }
});

// Export the router
module.exports = router;
