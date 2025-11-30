import React from "react";
import contactPhone from "../assets/images/howitworkimage.png"; // your phone image

function Contact() {
  return (
    <section id="contact" className="contact-section">

      {/* LEFT: PHONE IMAGE */}
      <div className="contact-left">
        <img src={contactPhone} alt="phone" className="contact-phone" />

        {/* White icon card */}
        {/* <div className="contact-card">
          <div className="card-item">
            <span className="check">✔</span>
            <p>Confirm payments</p>
          </div>

          <div className="card-item">
            <span className="bell">🔔</span>
            <p>Send Reminders</p>
          </div>
        </div> */}
      </div>

      {/* RIGHT: CONTACT DETAILS */}
      <div className="contact-right">
        <h2>Contact</h2>

        <ul className="contact-list">
          <li>
            📞  
            +234 706 311 5276 &nbsp;&nbsp; • &nbsp;&nbsp; +234 813 445 7451
          </li>

          <li>
            📧  
            Sharebillcompany@gmail.com
          </li>

          <li>
            🌐  
            Sharebill.com
          </li>

          <li>
            📍  
            Nigeria
          </li>
        </ul>
      </div>

    </section>
  );
}

export default Contact;
