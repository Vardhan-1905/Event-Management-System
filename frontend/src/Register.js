import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
    role: "participant"
  });

  const register = async () => {
    try {
      await axios.post("http://localhost:5001/api/register", data);
      alert("Registration Successful!");
      nav("/login");
    } catch {
      alert("Registration Failed. Please try again.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        padding: "40px",
        borderRadius: "15px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        width: "100%",
        maxWidth: "380px",
        textAlign: "center"
      }}>
        <p style={{ margin: "0 0 10px 0", color: "#11998e", fontSize: "14px", fontWeight: "700", letterSpacing: "1px" }}>Event Management System</p>
        <h2 style={{ margin: "0 0 25px 0", color: "#333", fontSize: "32px", fontWeight: "800" }}>Create Account ✨</h2>

        <div style={{ textAlign: "left", marginBottom: "15px" }}>
          <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555", marginLeft: "5px" }}>Email Address</label>
          <input
            placeholder="Enter a valid email"
            style={{ width: "90%", padding: "12px 15px", marginTop: "5px", border: "2px solid #e1e1e1", borderRadius: "8px", fontSize: "16px", outline: "none", transition: "border 0.3s" }}
            onFocus={(e) => e.target.style.borderColor = "#11998e"}
            onBlur={(e) => e.target.style.borderColor = "#e1e1e1"}
            onChange={e => setData({ ...data, email: e.target.value })}
          />
        </div>

        <div style={{ textAlign: "left", marginBottom: "15px" }}>
          <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555", marginLeft: "5px" }}>Secure Password</label>
          <input
            type="password"
            placeholder="Create a password"
            style={{ width: "90%", padding: "12px 15px", marginTop: "5px", border: "2px solid #e1e1e1", borderRadius: "8px", fontSize: "16px", outline: "none", transition: "border 0.3s" }}
            onFocus={(e) => e.target.style.borderColor = "#11998e"}
            onBlur={(e) => e.target.style.borderColor = "#e1e1e1"}
            onChange={e => setData({ ...data, password: e.target.value })}
          />
        </div>

        <div style={{ textAlign: "left", marginBottom: "15px" }}>
          <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555", marginLeft: "5px" }}>Choose Your Role</label>
          <select
            style={{ width: "100%", padding: "12px 15px", marginTop: "5px", border: "2px solid #e1e1e1", borderRadius: "8px", fontSize: "16px", outline: "none", cursor: "pointer", background: "white", transition: "border 0.3s" }}
            onFocus={(e) => e.target.style.borderColor = "#11998e"}
            onBlur={(e) => e.target.style.borderColor = "#e1e1e1"}
            onChange={e => setData({ ...data, role: e.target.value })}>
            <option value="participant">I am a Participant</option>
            <option value="organizer">I am an Organiser</option>
          </select>
        </div>

        <button
          onClick={register}
          style={{
            width: "100%",
            padding: "14px",
            margin: "20px 0 10px 0",
            background: "linear-gradient(to right, #11998e, #38ef7d)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(17, 153, 142, 0.4)",
            transition: "transform 0.2s"
          }}
          onMouseOver={(e) => e.target.style.transform = "scale(1.02)"}
          onMouseOut={(e) => e.target.style.transform = "scale(1)"}
        >
          Sign Up Now
        </button>

        <p style={{ marginTop: "20px", color: "#666", fontSize: "15px" }}>
          Already have an account? <span onClick={() => nav("/login")} style={{ color: "#11998e", fontWeight: "bold", cursor: "pointer" }}>Login Here</span>
        </p>
      </div>
    </div>
  );
}