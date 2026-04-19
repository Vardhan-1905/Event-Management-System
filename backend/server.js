const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

// DB
mongoose.connect("mongodb://127.0.0.1:27017/eventDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Models
const User = require("./models/User");
const Event = require("./models/Event");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join_event", (code) => {
    socket.join(code);
    console.log(`Socket ${socket.id} joined room ${code}`);
  });
});

// REGISTER
app.post("/api/register", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json({ msg: "Registered" });
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const user = await User.findOne(req.body);

  if (!user) return res.status(400).json({ msg: "Invalid" });

  res.json({ role: user.role });
});

// CREATE EVENT (Organiser)
app.post("/api/create-event", async (req, res) => {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  const event = new Event({ ...req.body, code });
  await event.save();

  res.json({ code });
});

// GET EVENT (Participant)
app.get("/api/event/:code", async (req, res) => {
  const event = await Event.findOne({ code: req.params.code });

  if (!event) return res.status(404).json({ msg: "Invalid Code" });

  res.json(event);
});

// GET MY EVENTS (Organiser)
app.get("/api/my-events/:email", async (req, res) => {
  const events = await Event.find({ organizer: req.params.email });
  res.json(events);
});

// RSVP (Participant)
app.post("/api/event/rsvp", async (req, res) => {
  const { code, status } = req.body;
  const event = await Event.findOne({ code });

  if (!event) return res.status(404).json({ msg: "Event not found" });

  if (status === "attending") {
    event.attending += 1;
  } else if (status === "notAttending") {
    event.notAttending += 1;
  }

  await event.save();
  io.to(code).emit("update_rsvp", { attending: event.attending, notAttending: event.notAttending });
  res.json({ msg: "RSVP submitted" });
});

server.listen(5001, () => console.log("Server running on port 5001"));
