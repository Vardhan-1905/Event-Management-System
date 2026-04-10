const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "organizer", "participant"]
  }
});

module.exports = mongoose.model("User", userSchema);