const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Ensure email is required and unique
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "staff", "committee", "instructor"],
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
