import React from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const Header = () => {
  return (
    <header>
      <div className="left-section">
        <Link to="/">
          <img
            className="logo"
            src="/RecipeNestLogo.png"
            alt="RecipeNest Logo"
          />
        </Link>
      </div>
      <div className="nav-search">
        <input
          type="text"
          className="search-input"
          placeholder="What recipe would you like to see today?"
        />
        <button className="search-icon">
          <FaSearch />
        </button>
      </div>
      <div className="auth-buttons">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </header>
  );
};

export default Header;
