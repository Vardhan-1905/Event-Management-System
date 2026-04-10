const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// DB
mongoose.connect("mongodb://127.0.0.1:27017/eventDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Models
const User = require("./models/User");
const Event = require("./models/Event");

// Socket.IO Communication Process
io.on("connection", (socket) => {
  console.log("A user connected to the live socket: " + socket.id);

  // When a user joins an event room
  socket.on("join_event", (eventCode) => {
    socket.join(eventCode);
    console.log(`User mapped to event: ${eventCode}`);

    // Emit the new updated count of live viewers in this room
    const count = io.sockets.adapter.rooms.get(eventCode)?.size || 0;
    io.to(eventCode).emit("update_count", count);
  });

  // Receive a message and broadcast it to everyone in the exact same event
  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
  });

  // Automatically update count when user closes their browser
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        const currentSize = io.sockets.adapter.rooms.get(room)?.size || 1;
        io.to(room).emit("update_count", currentSize - 1);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected: " + socket.id);
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

// RSVP TO EVENT
app.post("/api/event/rsvp", async (req, res) => {
  const { code, status } = req.body;
  try {
    const update = status === "attending" ? { attending: 1 } : { notAttending: 1 };
    const event = await Event.findOneAndUpdate(
      { code },
      { $inc: update },
      { new: true }
    );
    if (event) {
      // Broadcast the new totals via WebSockets INSTANTLY to the Organiser
      io.to(code).emit("update_rsvp", { attending: event.attending, notAttending: event.notAttending });
      res.json(event);
    } else {
      res.status(404).json({ msg: "Event not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Using server.listen instead of app.listen for websocket support
server.listen(5000, () => console.log("Server running on port 5000 with WebSockets"));