const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: String,
  date: String,
  time: String,
  venue: String,
  code: String,
  organizer: String,
  attending: { type: Number, default: 0 },
  notAttending: { type: Number, default: 0 }
});

module.exports = mongoose.model("Event", EventSchema);