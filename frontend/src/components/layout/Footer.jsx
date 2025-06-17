import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer>
  <p className="footer-title">Currently we are supporting:</p>
  <div className="footer-links">
    <Link to="https://www.ryans.com/" target="_blank">Ryans</Link>
    <Link to="https://www.startech.com.bd/" target="_blank">StarTech</Link>
    <Link to="https://www.techlandbd.com/" target="_blank">Techlandbd</Link>
    <Link to="https://www.pchouse.com.bd/" target="_blank">Pchouse</Link>
  </div>
</footer>

  );
};

export default Footer;
