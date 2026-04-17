import axios from "axios";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5001");

export default function Organiser() {
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    venue: ""
  });
  const [code, setCode] = useState("");

  // RSVP Analytics state
  const [rsvp, setRsvp] = useState({ attending: 0, notAttending: 0 });

  // My Events state
  const [events, setEvents] = useState([]);

  const createEvent = async () => {
    const organizer = localStorage.getItem("email");
    const res = await axios.post("http://localhost:5001/api/create-event", { ...form, organizer });
    setCode(res.data.code);

    // Connect to the socket room to listen for live RSVP updates
    socket.emit("join_event", res.data.code);

    // Refresh events
    fetchEvents();
  };

  const fetchEvents = async () => {
    const email = localStorage.getItem("email");
    if (email) {
      const res = await axios.get(`http://localhost:5001/api/my-events/${email}`);
      setEvents(res.data);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Listen for live RSVP button clicks from participants
    socket.on("update_rsvp", (data) => setRsvp(data));

    return () => {
      socket.off("update_rsvp");
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px", background: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>

      <div style={{ maxWidth: "800px", margin: "0 auto", background: "rgba(255, 255, 255, 0.95)", borderRadius: "15px", boxShadow: "0 15px 35px rgba(0,0,0,0.2)", overflow: "hidden" }}>

        {/* Header Section */}
        <div style={{ background: "#1b748f", padding: "30px", color: "white", textAlign: "center" }}>
          <h2 style={{ margin: "0 0 10px 0", fontSize: "32px", fontWeight: "800" }}>Organiser Dashboard</h2>
          <p style={{ margin: 0, fontSize: "16px", opacity: 0.9 }}>Coordinate your workshop and track attendee RSVPs in real-time.</p>
        </div>

        <div style={{ padding: "40px" }}>

          {/* Create Event Section */}
          <div style={{ marginBottom: code ? "40px" : "0" }}>
            <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px", color: "#333", fontSize: "22px" }}>1. Create Workshop Module</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "20px" }}>
              <input placeholder="Workshop Title" style={{ padding: "12px 15px", border: "2px solid #e1e1e1", borderRadius: "8px", fontSize: "16px", outline: "none" }} onChange={e => setForm({ ...form, title: e.target.value })} />
              <input placeholder="Venue Location" style={{ padding: "12px 15px", border: "2px solid #e1e1e1", borderRadius: "8px", fontSize: "16px", outline: "none" }} onChange={e => setForm({ ...form, venue: e.target.value })} />
              <input type="date" style={{ padding: "12px 15px", border: "2px solid #e1e1e1", borderRadius: "8px", fontSize: "16px", outline: "none" }} onChange={e => setForm({ ...form, date: e.target.value })} />
              <input type="time" style={{ padding: "12px 15px", border: "2px solid #e1e1e1", borderRadius: "8px", fontSize: "16px", outline: "none" }} onChange={e => setForm({ ...form, time: e.target.value })} />
            </div>

            <button
              style={{ width: "100%", padding: "15px", marginTop: "25px", background: "linear-gradient(to right, #2193b0, #6dd5ed)", color: "white", border: "none", borderRadius: "8px", fontSize: "18px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 15px rgba(33, 147, 176, 0.4)", transition: "transform 0.2s" }}
              onMouseOver={(e) => e.target.style.transform = "scale(1.01)"}
              onMouseOut={(e) => e.target.style.transform = "scale(1)"}
              onClick={createEvent}
            >
              🚀 Generate Event Code
            </button>
          </div>

          {/* Analytics Section */}
          {code && (
            <div style={{ background: "#f8fbff", border: "2px dashed #2193b0", borderRadius: "10px", padding: "30px", textAlign: "center", animation: "fadeIn 0.5s ease-in" }}>
              <h3 style={{ color: "#555", margin: "0 0 10px 0", fontSize: "18px", textTransform: "uppercase", letterSpacing: "1px" }}>Share this Code</h3>
              <h1 style={{ color: "#2193b0", fontSize: "56px", margin: "0 0 25px 0", letterSpacing: "4px" }}>{code}</h1>

              <div style={{ background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
                <h4 style={{ margin: "0 0 20px 0", fontSize: "22px", color: "#333" }}>📊 Live RSVP Statistics</h4>

                <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                  <div style={{ flex: 1, background: "#e8f5e9", color: "#2e7d32", padding: "20px", borderRadius: "8px", border: "1px solid #c8e6c9" }}>
                    <h2 style={{ fontSize: "42px", margin: "0" }}>{rsvp.attending}</h2>
                    <p style={{ margin: "10px 0 0 0", fontWeight: "bold", fontSize: "16px" }}>✅ Will Attend</p>
                  </div>

                  <div style={{ flex: 1, background: "#ffebee", color: "#c62828", padding: "20px", borderRadius: "8px", border: "1px solid #ffcdd2" }}>
                    <h2 style={{ fontSize: "42px", margin: "0" }}>{rsvp.notAttending}</h2>
                    <p style={{ margin: "10px 0 0 0", fontWeight: "bold", fontSize: "16px" }}>❌ Not Attending</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* My Events Section */}
        <div style={{ padding: "40px" }}>
          <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px", color: "#333", fontSize: "22px" }}>My Events</h3>
          {events.length === 0 ? (
            <p>No events created yet.</p>
          ) : (
            <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
              {events.map(event => (
                <div key={event._id} style={{ background: "#f8fbff", border: "1px solid #2193b0", borderRadius: "10px", padding: "20px" }}>
                  <h4>{event.title}</h4>
                  <p>Date: {event.date} | Time: {event.time} | Venue: {event.venue}</p>
                  <p>Code: {event.code}</p>
                  <p>Attending Participants: {event.attending}</p>
                  <p>Not Attending: {event.notAttending}</p>
                  <p style={{ fontWeight: "700" }}>Total RSVPs: {event.attending + event.notAttending}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}