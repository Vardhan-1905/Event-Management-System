import axios from "axios";
import { useState } from "react";

export default function Participant() {
  const [code, setCode] = useState("");
  const [event, setEvent] = useState(null);

  // RSVP State
  const [hasRSVPed, setHasRSVPed] = useState(false);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/event/${code}`);
      setEvent(res.data);
    } catch {
      alert("Invalid Code. Please ask the organiser for the correct code.");
    }
  };

  const submitRsvp = async (status) => {
    try {
      await axios.post("http://localhost:5001/api/event/rsvp", { code, status });
      setHasRSVPed(true);
    } catch {
      alert("Failed to submit RSVP");
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px", background: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", display: "flex", alignItems: "center" }}>

      <div style={{ maxWidth: "600px", margin: "0 auto", width: "100%", background: "rgba(255, 255, 255, 0.95)", borderRadius: "15px", boxShadow: "0 15px 35px rgba(0,0,0,0.2)", overflow: "hidden" }}>

        {/* Header Section */}
        <div style={{ background: "#e86a51", padding: "30px", color: "white", textAlign: "center" }}>
          <h2 style={{ margin: "0 0 10px 0", fontSize: "32px", fontWeight: "800" }}>Participant Portal</h2>
          <p style={{ margin: 0, fontSize: "16px", opacity: 0.9 }}>Enter your Organiser's code to view and RSVP to your workshop.</p>
        </div>

        <div style={{ padding: "40px" }}>
          {!event ? (
            <div style={{ textAlign: "center" }}>
              <input
                placeholder="Enter Event Code"
                style={{ width: "100%", padding: "18px", marginBottom: "20px", border: "2px dashed #bbb", borderRadius: "8px", fontSize: "28px", textAlign: "center", textTransform: "uppercase", letterSpacing: "3px", outline: "none", boxSizing: "border-box", color: "#333", fontWeight: "bold" }}
                onChange={e => setCode(e.target.value.toUpperCase())}
              />
              <button
                style={{ width: "100%", padding: "16px", background: "linear-gradient(to right, #ff7e5f, #feb47b)", color: "white", border: "none", borderRadius: "8px", fontSize: "20px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 15px rgba(255, 126, 95, 0.4)", transition: "transform 0.2s" }}
                onMouseOver={(e) => e.target.style.transform = "scale(1.02)"}
                onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                onClick={fetchEvent}
              >
                Access Workshop
              </button>
            </div>
          ) : (
            <div style={{ animation: "fadeIn 0.5s ease-in" }}>
              <h3 style={{ color: "#333", borderBottom: "2px solid #f0f0f0", paddingBottom: "15px", fontSize: "26px", margin: "0 0 20px 0" }}>{event.title}</h3>

              <div style={{ background: "#fff5f2", padding: "20px", borderRadius: "10px", fontSize: "18px", marginBottom: "30px", display: "grid", gap: "12px", borderLeft: "4px solid #ff7e5f" }}>
                <p style={{ margin: 0 }}><strong>📍 Venue:</strong> {event.venue}</p>
                <p style={{ margin: 0 }}><strong>📅 Date:</strong> {event.date}</p>
                <p style={{ margin: 0 }}><strong>⏰ Time:</strong> {event.time}</p>
              </div>

              <div style={{ background: "white", padding: "25px", borderRadius: "10px", border: "1px solid #eee", boxShadow: "0 5px 15px rgba(0,0,0,0.03)", textAlign: "center" }}>
                {!hasRSVPed ? (
                  <div>
                    <h4 style={{ marginTop: 0, fontSize: "22px", color: "#444" }}>Will you attend?</h4>
                    <p style={{ color: "#888", marginBottom: "25px", fontSize: "16px" }}>Please submit your official RSVP response below.</p>
                    <div style={{ display: "flex", gap: "15px" }}>
                      <button
                        style={{ flex: 1, background: "#4CAF50", color: "white", padding: "15px", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 4px 10px rgba(76, 175, 80, 0.3)", transition: "transform 0.2s" }}
                        onMouseOver={(e) => e.target.style.transform = "scale(1.03)"}
                        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                        onClick={() => submitRsvp("attending")}>
                        ✅ Yes, I Will Attend
                      </button>
                      <button
                        style={{ flex: 1, background: "#f44336", color: "white", padding: "15px", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 4px 10px rgba(244, 67, 54, 0.3)", transition: "transform 0.2s" }}
                        onMouseOver={(e) => e.target.style.transform = "scale(1.03)"}
                        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                        onClick={() => submitRsvp("notAttending")}>
                        ❌ No, I Cannot
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: "20px 0" }}>
                    <div style={{ fontSize: "50px", marginBottom: "10px" }}>✅</div>
                    <h4 style={{ color: "#4CAF50", fontSize: "28px", margin: "0" }}>Thank You!</h4>
                    <p style={{ margin: "10px 0 0 0", fontSize: "16px", color: "#666" }}>Your RSVP response has been successfully sent to the Organiser.</p>
                  </div>
                )}
              </div>
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