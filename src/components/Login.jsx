import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import phone21 from "../assets/images/phone21.png";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.email || !form.password) {
      setError("All fields are required.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const res = await axios.post(
        "https://YOUR_BACKEND_URL/login",
        form
      );

      if (res.data.success) {
        alert("Login successful!");
      } else {
        setError(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error. Try again.");
    }
  };

  return (
    <div className="auth-container fade-in">

      <div className="auth-left slide-up">
        <h1>Login/ Create Account</h1>
        <p className="welcome-text">Welcome back!<br />Let's help you keep your bills organized</p>

        {error && <p className="error-text">{error}</p>}

        <label>Email/Phone</label>
        <input
          name="email"
          type="text"
          placeholder="Input email/phone"
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          placeholder="Input Password"
          onChange={handleChange}
        />

        <button className="auth-btn" onClick={handleLogin}>Login</button>

        <p className="switch-text">
          Don't have an account? <Link to="/create-account">Create Account</Link>
        </p>

        <p className="terms-text">
          By signing in, you agree to our <span>Terms & Privacy</span>
        </p>
      </div>

      <div className="auth-right fade-in">
        <img src={phone21} className="auth-phone" alt="phone" />
      </div>

    </div>
  );
}

export default Login;
