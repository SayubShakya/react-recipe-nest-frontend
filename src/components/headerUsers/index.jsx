import React, { useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { Search, LogOut } from "lucide-react";

const HeaderUsers = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    console.log("User logging out...");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setShowConfirm(false);
    navigate("/");
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <header className="header-users">
        <div className="header-users__logo-section">
          <div className="header-users__logo-link">
            <div className="header-users__logo">
              <img src="/RecipeNestLogo.png" alt="RecipeNest Logo" />
              <span className="header-users__logo-text">RecipeNest</span>
            </div>
          </div>
        </div>

        <div className="header-users__search">
          <input
            type="text"
            className="header-users__search-input"
            placeholder="Search recipes, chefs, ingredients..."
          />
          <button className="header-users__search-button">
            <Search size={18} />
          </button>
        </div>

        <button className="header-users__logout" onClick={handleLogout}>
          <LogOut size={18} className="header-users__logout-icon" />
          <span>Logout</span>
        </button>
      </header>

      {showConfirm && (
        <div className="confirm-box">
          <div className="confirm-content">
            <p>Do you want to logout?</p>
            <div className="confirm-buttons">
              <button className="btn-confirm" onClick={confirmLogout}>
                Yes
              </button>
              <button className="btn-cancel" onClick={cancelLogout}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderUsers;
