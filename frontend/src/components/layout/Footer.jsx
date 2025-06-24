import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer>
      {/* <Link to={"https://www.ryans.com/"} target="_blank" >Ryans</Link> */}
      {/* <Link to={"https://www.startech.com.bd/"} target="_blank" >StarTech</Link> */}
      {/* <Link to={"https://www.binarylogic.com.bd/"} target="_blank" >BINARY LOGIC</Link> */}
      {/* <Link to={"https://www.techlandbd.com/"} target="_blank" >TECHLAND</Link> */}
      <a href="" className = "sprt">Currently we are supporting :</a>
      <a href="https://www.ryans.com" class="btn">Ryans</a>
      <a href="https://www.startech.com" class="btn">StarTech</a>
      <a href="https://www.techlandbd.com" class="btn">TECHLAND</a>
      <a href="https://www.binarylogic.com" class="btn">Binary Logic</a>

    </footer>
  );
};

export default Footer;
