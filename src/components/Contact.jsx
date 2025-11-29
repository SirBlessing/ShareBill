import React from "react";

import howitworkimage from "../assets/images/howitworkimage.png"; // replace with your image

function Contact() {
  return (
    <section className="contact-section">
      <div className="phone-wrapper">
        <img src={howitworkimage} alt="Phone" className="contact-phone" />

      </div>

      <div className="contact-right">
        <h2>Contact</h2>

        <p><strong>Email:</strong> support@sharebill.com</p>
        <p><strong>Phone:</strong> +234 800 000 0000</p>
        <p><strong>Instagram:</strong> @sharebill</p>

        <br />

        <p>For partnership, support, or business inquiries, reach out anytime.</p>
      </div>
    </section>
  );
}

export default Contact;
