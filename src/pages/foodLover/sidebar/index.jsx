import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const sidebarLinks = [
    {
      label: "Browse Recipes",
      icon: "⚙️",
      link: "/foodLoverDashboard",
    },
    {
      label: "Edit Profile",
      icon: "👤",
      link: "/editProfile",
    },
    {
      label: "Favorites",
      icon: "❤️",
      link: "/favorites",
    },
    {
      label: "View Chefs",
      icon: "👁️",
      link: "/viewChefs",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      {sidebarLinks.map((link) => (
        <Link
          key={link.label}
          to={link.link}
          className={`sidebar-button ${
            isActive(link.link) ? "active-button" : "inactive-button"
          }`}
        >
          <span className="icon">{link.icon}</span> {link.label}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
