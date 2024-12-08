const express = require("express");
const router = express.Router();
const Course = require("../models/course");

router.get("/dashboard", async (req, res) => {
  const courses = await Course.find({ createdBy: req.cookies.userId });
  res.render("dashboard", { courses, role: "instructor" });
});

router.post("/add-course", async (req, res) => {
  const { name } = req.body;
  await Course.create({ name, createdBy: req.cookies.userId });
  res.redirect("/instructor/dashboard");
});

router.post("/delete-course", async (req, res) => {
  const { courseId } = req.body;
  await Course.findByIdAndDelete(courseId);
  res.redirect("/instructor/dashboard");
});

module.exports = router;
