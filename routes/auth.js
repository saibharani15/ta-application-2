const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Login
router.get("/login", (req, res) => res.render("login"));

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  if (user) {
    res.cookie("userId", user._id);
    res.cookie("role", user.role);
    res.redirect(`/${user.role}/dashboard`);
  } else {
    res.redirect("/auth/login");
  }
});

router.get("/register", (req, res) => {
  res.render("register"); // Render the registration page
});

router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Attempt to create a new user
    await User.create({ username, email, password, role });
    res.redirect("/auth/login");
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email) {
      res.status(400).send("Error: Email is already registered.");
    } else {
      res.status(500).send("Server Error: Unable to register user.");
    }
  }
});
module.exports = router;
