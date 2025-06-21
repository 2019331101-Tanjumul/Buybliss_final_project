import React from "react";

export const Button = ({ children, onClick, type, disabled, className }) => {
  function handleClick(event) {
    event.preventDefault();
    onClick();
  }

  return (
    <button className={className} type={type || "button"} disabled={disabled} onClick={handleClick}>
      {children}
    </button>
  );
};
