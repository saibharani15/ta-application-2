const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const Application = require("../models/application");

router.get("/dashboard", async (req, res) => {
  const courses = await Course.find();
  const applications = await Application.find({
    student: req.cookies.userId,
  }).populate("course");
  res.render("dashboard", { courses, applications, role: "student" });
});

router.post("/apply", async (req, res) => {
  const { courseId } = req.body;
  await Application.create({ student: req.cookies.userId, course: courseId });
  res.redirect("/student/dashboard");
});

module.exports = router;
