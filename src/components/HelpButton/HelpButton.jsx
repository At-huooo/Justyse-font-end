import React from "react";
import { useNavigate } from "react-router-dom";
import "./HelpButton.css"; // Import the CSS file

const HelpBtn = ({ navigateTo, scrollTo }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(navigateTo);
    setTimeout(() => {
      const targetElement = document.querySelector(scrollTo);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

  return (
    <button className="helpBtn" onClick={handleClick}>
      ?
    </button>
  );
};

export default HelpBtn;