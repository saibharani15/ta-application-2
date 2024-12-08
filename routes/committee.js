const express = require("express");
const router = express.Router();
const Application = require("../models/application");

// Committee Dashboard: View All Applications
router.get("/dashboard", async (req, res) => {
  try {
    // Fetch all applications and populate student and course data
    const applications = await Application.find().populate("student course");
    res.render("applications", { applications, role: "committee" });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).render("error", {
      message: "Failed to load applications. Please try again later.",
    });
  }
});

// Update Application Status
router.post("/update-status", async (req, res) => {
  try {
    let { applicationId, status } = req.body;

    // Handle case where `status` might be an array
    if (Array.isArray(status)) {
      status = status[0];
    }

    console.log("Processed Status:", status);

    // Validate status value
    if (!["pending", "approved", "denied"].includes(status)) {
      return res.status(400).render("error", {
        message: "Invalid status value. Please select a valid status.",
      });
    }

    // Update the application's status in the database
    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).render("error", {
        message: "Application not found. Unable to update status.",
      });
    }

    console.log(`Application ${applicationId} updated to status: ${status}`);
    res.redirect("/committee/dashboard");
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).render("error", {
      message: "Failed to update application status. Please try again later.",
    });
  }
});

module.exports = router;
