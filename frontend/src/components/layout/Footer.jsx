import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
   <footer className="footer">
      <h1 className="tss">We support:</h1>
      <div className="foot-logo">
        <img src="/ryans-logo.svg" alt="company logo" className="footer-logo" />
        <img src="/star-tech-logo.png" alt="company logo" className="footer-logo" />
        <img src="/techland-logo.png" alt="company logo" className="footer-logo" />
        <img src="/binary-logic-logo.webp" alt="company logo" className="footer-logo" />
        <img src="/skyland-logo.webp" alt="company logo" className="footer-logo" />
        <img src="/ucc-logo.webp" alt="company logo" className="footer-logo" />
        <img src="/global-brand-logo.svg" alt="company logo" className="footer-logo" />
        <img src="/ultra-tech-logo.png.webp" alt="company logo" className="footer-logo" />
        <img src="/diamu-logo.webp" alt="company logo" className="footer-logo" />
        <img src="/creatus-computer-logo.webp" alt="company logo" className="footer-logo" />
      </div>
    </footer>
  );
};

export default Footer;