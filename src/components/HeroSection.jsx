import React from "react";
// import "./App.css";
import { useNavigate,  Link } from "react-router-dom";

import phone1 from "../assets/images/phone1.png"; 
import phone2 from "../assets/images/phone2.jpg";
import phone3 from "../assets/images/phone3.jpg";
import herosecimage from "../assets/images/herosecimage.png";
export default function HeroSection() {
   const navigate = useNavigate();
  return (
    <div className="hero-container">
      
      {/* NAVBAR */}
      {/* <nav className="navbar">
        <div className="logo">ShareBill</div>

        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">How it works</a>
          <a href="#">Contact</a>
        </div>

        <div className="menu-icon">≡</div>
      </nav> */}

      {/* HERO CONTENT */}
      <div className="hero-content">

        <div className="hero-text">
          <h1>
            Share bills anywhere. <br />
            Collect payments easily
          </h1>

          <p className="sub-text">
            <strong>Create. Share. Confirm. Simple.</strong>
          </p>

          {/* <button className="cta-btn"
           onClick={() => navigate("/createaccount")}
           >CREATE A BILL</button> */}

           <Link to="/create-account">
  <button className="cta-btn">Create a Bill</button>
</Link>
        </div>

        <div className="hero-images">
          {/* <img src={phone1} alt="phone" />
          <img src={phone2} alt="phone" />
          <img src={phone3} alt="phone" /> */}
        <img src={herosecimage} alt="hero section" />
        </div>

      </div>

    </div>
  );
}
