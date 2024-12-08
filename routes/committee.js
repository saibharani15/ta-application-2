const express = require("express");
const router = express.Router();
const Application = require("../models/application");

router.get("/dashboard", async (req, res) => {
  try {
    const applications = await Application.find().populate("student course");
    res.render("applications", { applications, role: "committee" });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/update-status", async (req, res) => {
  try {
    let { applicationId, status } = req.body;

    // If status is an array, get the first value
    if (Array.isArray(status)) {
      status = status[0];
    }

    console.log("Processed Status:", status);

    if (!["pending", "approved", "denied"].includes(status)) {
      return res.status(400).send("Invalid status value");
    }

    await Application.findByIdAndUpdate(applicationId, { status });
    res.redirect("/committee/dashboard");
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
