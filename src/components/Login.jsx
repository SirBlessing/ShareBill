import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import phone21 from "../assets/images/phone21.png";

function Login() {
 const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/login",
        form
      );

      if (res.data.success) {
        // Success → redirect
        navigate("/dashboard");
      } else {
        setError(res.data.message || "Invalid credentials");
      }
    } catch (err) {
  if (err.response) {
    setError(err.response.data.message || "Invalid credentials");
  } else {
    setError("Network error. Try again.");
  }
}


    setLoading(false);
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
          placeholder="Input email or phone"
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          placeholder="Input Password"
          onChange={handleChange}
        />

         <button
          className="auth-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <div className="spinner"></div> : "Login"}
        </button>

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
