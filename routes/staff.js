const express = require("express");
const router = express.Router();
const Course = require("../models/course");

// Staff Dashboard
router.get("/dashboard", async (req, res) => {
  try {
    // Fetch courses created by the logged-in staff member
    const courses = await Course.find({ createdBy: req.cookies.userId }).sort({
      createdAt: -1,
    });

    res.render("dashboard", {
      courses,
      role: req.cookies.role || null,
    });
  } catch (error) {
    console.error("Error loading staff dashboard:", error);
    res.status(500).render("error", {
      message: "Failed to load the dashboard. Please try again later.",
    });
  }
});

// Add a New Course
router.post("/add-course", async (req, res) => {
  try {
    const { name } = req.body;

    // Validate course name
    if (!name || name.trim().length === 0) {
      return res.status(400).render("error", {
        message: "Course name cannot be empty.",
      });
    }

    // Check for duplicate course names for the same staff member
    const existingCourse = await Course.findOne({
      name: name.trim(),
      createdBy: req.cookies.userId,
    });
    if (existingCourse) {
      return res.status(400).render("error", {
        message: "A course with this name already exists.",
      });
    }

    // Create a new course
    await Course.create({ name: name.trim(), createdBy: req.cookies.userId });
    res.redirect("/staff/dashboard");
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).render("error", {
      message: "Failed to add the course. Please try again later.",
    });
  }
});

// Delete a Course
router.post("/delete-course", async (req, res) => {
  try {
    const { courseId } = req.body;

    // Validate course ID
    if (!courseId) {
      return res.status(400).render("error", {
        message: "Course ID is required to delete a course.",
      });
    }

    // Check if the course exists and belongs to the logged-in staff member
    const course = await Course.findOne({
      _id: courseId,
      createdBy: req.cookies.userId,
    });
    if (!course) {
      return res.status(404).render("error", {
        message: "Course not found or you are not authorized to delete it.",
      });
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);
    res.redirect("/staff/dashboard");
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).render("error", {
      message: "Failed to delete the course. Please try again later.",
    });
  }
});

module.exports = router;
