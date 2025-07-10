import React from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="left-section">
          <Link to={"/"}>
            {" "}
            <img
              src="/RecipeNestLogo.png"
              alt="RecipeNest Logo"
              className="footer-logo"
            />
          </Link>
          <p>Namaste from RecipeNest</p>
          <p>Join our community of chefs and food lovers!</p>
          <div className="social-icons">
            {" "}
            <a href="https://twitter.com/">
              <FaTwitter size={30} className="social-icon twitter" />
            </a>
            <a href="https://facebook.com/">
              <FaFacebook size={30} className="social-icon facebook" />
            </a>
            <a href="https://linkedin.com/">
              <FaLinkedin size={30} className="social-icon linkedin" />
            </a>
            <a href="https://instagram.com/">
              <FaInstagram size={30} className="social-icon instagram" />
            </a>
          </div>
        </div>

        <div className="middle-section">
          {" "}
          <div className="category-column">
            <h3>For Cuisine</h3>
            <ul>
              <li>
                <Link to="/">Nepali</Link>
              </li>
              <li>
                <Link to="/">Thai</Link>
              </li>
              <li>
                <Link to="/">American</Link>
              </li>
              <li>
                <Link to="/">Indian</Link>
              </li>
            </ul>
          </div>
          <div className="category-column">
            <h3>Recipe Categories</h3>
            <ul>
              <li>Vegetarian</li>
              <li>Gluten-Free</li>
              <li>Quick Meals</li>
              <li>Family Favorites</li>
              <li>Gourmet</li>
            </ul>
          </div>
          <div className="pages-column">
            <h3>Explore</h3>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/">Recipes</Link>
              </li>
              <li>
                <Link to="/">About Us</Link>
              </li>
              <li>
                <Link to="/">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="footer-divider" />{" "}
      <div className="copyright"> © 2025 RecipeNest. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
