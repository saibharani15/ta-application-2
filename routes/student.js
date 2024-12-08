const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const Application = require("../models/application");

// Student Dashboard: View Courses and Applications
router.get("/dashboard", async (req, res) => {
  try {
    // Fetch all courses
    const courses = await Course.find();

    // Fetch applications made by the logged-in student
    const applications = await Application.find({
      student: req.cookies.userId,
    }).populate("course");

    // Render the dashboard with courses and applications
    res.render("dashboard", { courses, applications, role: "student" });
  } catch (error) {
    console.error("Error loading student dashboard:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Apply for a Course
router.post("/apply", async (req, res) => {
  try {
    const { courseId } = req.body;

    // Validate courseId
    if (!courseId) {
      return res.status(400).send("Course ID is required.");
    }

    // Check if the student has already applied for this course
    const existingApplication = await Application.findOne({
      student: req.cookies.userId,
      course: courseId,
    });

    if (existingApplication) {
      return res.status(400).send("You have already applied for this course.");
    }

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).send("Course not found.");
    }

    // Create a new application
    await Application.create({ student: req.cookies.userId, course: courseId });
    res.redirect("/student/dashboard");
  } catch (error) {
    console.error("Error applying for course:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
