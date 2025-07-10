import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const sidebarLinks = [
    {
      label: "Dashboard",
      icon: "📊",
      link: "/adminDashboard",
    },
    {
      label: "Edit Profile",
      icon: "👤",
      link: "/adminEditProfile",
    },
    {
      label: "Manage Users",
      icon: "👥",
      link: "/manageUsers",
    },
    {
      label: "Manage Cuisines",
      icon: "🗂️",
      link: "/ManageCuisine",
    },
    {
      label: "Manage Roles",
      icon: "⚙️",
      link: "/manageRoles",
    },
    {
      label: "Manage Recipes",
      icon: "📋",
      link: "/manageRecipeAdmin",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-menu">
        {(sidebarLinks || []).map((link) => (
          <Link
            key={link?.label}
            to={link?.link}
            className={`admin-sidebar-item ${
              isActive(link?.link) ? "admin-active" : ""
            }`}
          >
            <span className="admin-sidebar-icon">{link?.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
