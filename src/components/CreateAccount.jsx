import React from "react";
import { useNavigate,  Link } from "react-router-dom";
import phone21 from "../assets/images/phone21.png";

function CreateAccount() {
  return (
    <div className="create-account-container">
      <div className="create-left">
        <h1>Create Account</h1>
        <p className="subtitle">
          Let's get you started — Bill sharing just became stress-free
        </p>

        <form className="create-form">
          <label>Full Name</label>
          <input type="text" placeholder="Enter Full Name" />

          <label>Email / Phone</label>
          <input type="text" placeholder="Input email/phone" />

          <label>Password</label>
          <input type="password" placeholder="Input password" />

          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm password" />

          <button type="submit" className="create-btn">
            Create Account
          </button>

          <p className="login-text">
            Already have an account? <span><Link to="/Login">Login Here</Link></span>
          </p>

          <p className="terms">
            By logging in, you agree to our <span>Terms & Privacy</span>
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
