import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5001/api/login", data);

      localStorage.setItem("email", data.email);

      if (res.data.role === "organizer") {
        nav("/organiser");
      } else {
        nav("/participant");
      }

    } catch {
      alert("Invalid login. Please check your credentials.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
        <h2 style={{ margin: "0 0 25px 0", color: "#333", fontSize: "32px", fontWeight: "800" }}>Welcome Back 👋</h2>

        <div style={{ textAlign: "left", marginBottom: "15px" }}>
          <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555", marginLeft: "5px" }}>Email Address</label>
          <input
            placeholder="Enter your email"
            style={{ width: "90%", padding: "12px 15px", marginTop: "5px", border: "2px solid #e1e1e1", borderRadius: "8px", fontSize: "16px", outline: "none", transition: "border 0.3s" }}
            onFocus={(e) => e.target.style.borderColor = "#764ba2"}
            onBlur={(e) => e.target.style.borderColor = "#e1e1e1"}
            onChange={e => setData({ ...data, email: e.target.value })}
          />
        </div>

        <div style={{ textAlign: "left", marginBottom: "15px" }}>
          <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555", marginLeft: "5px" }}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            style={{ width: "90%", padding: "12px 15px", marginTop: "5px", border: "2px solid #e1e1e1", borderRadius: "8px", fontSize: "16px", outline: "none", transition: "border 0.3s" }}
            onFocus={(e) => e.target.style.borderColor = "#764ba2"}
            onBlur={(e) => e.target.style.borderColor = "#e1e1e1"}
            onChange={e => setData({ ...data, password: e.target.value })}
          />
        </div>

        <button
          onClick={login}
          style={{
            width: "100%",
            padding: "14px",
            margin: "20px 0 10px 0",
            background: "linear-gradient(to right, #667eea, #764ba2)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(118, 75, 162, 0.4)",
            transition: "transform 0.2s"
          }}
          onMouseOver={(e) => e.target.style.transform = "scale(1.02)"}
          onMouseOut={(e) => e.target.style.transform = "scale(1)"}
        >
          Sign In
        </button>

        <p style={{ marginTop: "20px", color: "#666", fontSize: "15px" }}>
          Don't have an account? <span onClick={() => nav("/register")} style={{ color: "#764ba2", fontWeight: "bold", cursor: "pointer" }}>Register Here</span>
        </p>
      </div>
    </div>
  );
}