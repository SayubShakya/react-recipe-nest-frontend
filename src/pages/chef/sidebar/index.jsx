import { Link } from "react-router";

const Sidebar = () => {
  const sidebarLinks = [
    {
      label: "Dashboard",
      icon: "📊",
      link: "/chefDashboard",
    },
    {
      label: "Edit Profile",
      icon: "👤",
      link: "/editChefProfile",
    },
    {
      label: "Create Recipe",
      icon: "📝",
      link: "/createRecipe",
    },
    {
      label: "Manage Recipes",
      icon: "📋",
      link: "/manageRecipe",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="chef-sidebar">
      {(sidebarLinks || []).map((link) => (
        <Link
          key={link?.label}
          to={link?.link}
          className={`chef-sidebar-item ${isActive(link.link) ? "active" : ""}`}
        >
          <span className="sidebar-icon">{link?.icon}</span>
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
