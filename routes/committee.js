const express = require("express");
const router = express.Router();
const Application = require("../models/application");

router.get("/dashboard", async (req, res) => {
  const applications = await Application.find().populate("student course");
  res.render("applications", { applications, role: "committee" });
});

router.post("/update-status", async (req, res) => {
  const { applicationId, status } = req.body;
  await Application.findByIdAndUpdate(applicationId, { status });
  res.redirect("/committee/dashboard");
});

module.exports = router;
