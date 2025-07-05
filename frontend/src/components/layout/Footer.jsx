import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer>
      <Link to={"https://www.ryans.com/"} target="_blank" >Ryans</Link>
      <Link to={"https://www.startech.com.bd/"} target="_blank" >StarTech</Link>
    </footer>
  );
};

export default Footer;
