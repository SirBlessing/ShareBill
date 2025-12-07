import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import phone21 from "../assets/images/phone21.png";
import axios from "axios";

function CreateAccount() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone_number:"",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -------------------------
  // VALIDATION FIXED HERE
  // -------------------------
  const validate = () => {
  const { fullname, email,phone_number, password, confirmPassword } = form;

  if (!fullname || !email|| !phone_number || !password || !confirmPassword) {
    setError("All fields are required.");
    return false;
  }

  // Basic email / phone validation
  const emailRegex = /\S+@\S+\.\S+/;
  const phoneRegex = /^[0-9]{10,15}$/;

  if (!emailRegex.test(email) && !phoneRegex.test(email)) {
    setError("Enter a valid email or phone number.");
    return false;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters.");
    return false;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return false;
  }

  return true;
};


 const handleCreate = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);
  setError("");

  try {
    const res = await axios.post("http://localhost:5000/auth/register", {
      fullname: form.fullname,
     email: form.email,
      phone_number: form.phone_number,
      password: form.password,
    });

    if (res.data.success) {
      navigate("/login");
    } else {
      setError(res.data.message || "Signup failed.");
    }
 } catch (err) {
  if (err.response) {
    setError(err.response.data.message || "Signup error");
  } else {
    setError("Network error. Try again.");
  }
}


  setLoading(false);
};


  return (
    <div className="create-account-container">
      <div className="create-left">
        <h1>Create Account</h1>
        <p className="subtitle">
          Let's get you started — Bill sharing just became stress-free
        </p>

        {error && <p className="error-text">{error}</p>}

        <form className="create-form" onSubmit={handleCreate}>
          <label>Full Name</label>
          <input
            name="fullname"
            type="text"
            placeholder="Enter full name"
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            name="email"
            type="text"
            placeholder="Enter your email "
            onChange={handleChange}
          />
            <label>Phone</label>
          <input
            name="phone_number"
            type="text"
            placeholder="Enter  phone number"
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Create password"
            onChange={handleChange}
          />

          <label>Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            onChange={handleChange}
          />

          <button className="auth-btn" disabled={loading}>
            {loading ? <div className="spinner"></div> : "Create Account"}
          </button>

          <p className="login-text">
            Already have an account?{" "}
            <span>
              <Link to="/login">Login Here</Link>
            </span>
          </p>

          <p className="terms">
            By signing up, you agree to our <span>Terms & Privacy</span>
          </p>
        </form>
      </div>

      <div className="create-right">
        <img src={phone21} alt="People using app" />
      </div>
    </div>
  );
}

export default CreateAccount;
