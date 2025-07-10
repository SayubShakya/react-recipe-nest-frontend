import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./chefDashboard.css";
import Sidebar from "../sidebar";
import useApi from "../../../api";

const ChefDashboard = () => {
  const currentLoggedInUser = JSON.parse(sessionStorage.getItem("user"));
  const { fetchData } = useApi();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [showAllRecipes, setShowAllRecipes] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState({
    cuisine: "",
    category: "",
    dietary: "",
  });

  useEffect(() => {
    const today = new Date();
    setCurrentDate(
      today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData("recipes");
      if (response?.ok) {
        const result = await response.json();
        setRecipes(result?.data?.items || []);
      } else {
        setError(`Error: ${response?.status}`);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch recipes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e, type) => {
    setFilters((prev) => ({ ...prev, [type]: e.target.value }));
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      (filters.cuisine === "" || recipe.cuisine === filters.cuisine) &&
      (filters.category === "" || recipe.category === filters.category) &&
      (filters.dietary === "" || recipe.dietary === filters.dietary)
  );

  return (
    <div className="chef-dashboard-container">
      <Sidebar />

      <div className="chef-main-content">
        <div className="chef-header">
          <div className="chef-welcome-banner">
            <div className="welcome-text">
              <h1>
                Welcome, {currentLoggedInUser?.name || ""}! Time to create,
                inspire, and lead the kitchen
              </h1>
              <p>Passion on the Plate, Precision in the Kitchen</p>
            </div>
            <div className="chef-profile-image">
              {currentLoggedInUser?.profileImage && (
                <img
                  src={currentLoggedInUser.profileImage}
                  alt={currentLoggedInUser.name}
                />
              )}
            </div>
          </div>

          <div className="chef-filters">
            <div className="chef-filter">
              <select
                className="chef-filter-dropdown"
                value={filters.cuisine}
                onChange={(e) => handleFilterChange(e, "cuisine")}
              >
                <option value="">Filter by cuisine</option>
                <option value="Nepali">Nepali</option>
                <option value="Indian">Indian</option>
                <option value="Thai">Thai</option>
                <option value="American">American</option>
              </select>
            </div>

            <div className="chef-filter">
              <select
                className="chef-filter-dropdown"
                value={filters.category}
                onChange={(e) => handleFilterChange(e, "category")}
              >
                <option value="">Filter by category</option>
                <option value="Main-course">Main Course</option>
                <option value="Snack">Snack</option>
                <option value="Soup">Soup</option>
                <option value="Salad">Salad</option>
              </select>
            </div>

            <div className="chef-filter">
              <select
                className="chef-filter-dropdown"
                value={filters.dietary}
                onChange={(e) => handleFilterChange(e, "dietary")}
              >
                <option value="">Filter by dietary restrictions</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>
            </div>
          </div>
        </div>

        <div className="chef-recipes-section">
          <div className="chef-section-header">
            <h2>View Recipe Portfolio</h2>
            <button
              className="chef-view-all"
              onClick={() => setShowAllRecipes(!showAllRecipes)}
            >
              {showAllRecipes ? "Show Less" : "View All"}
            </button>
          </div>

          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="chef-recipes-grid">
              {(showAllRecipes
                ? filteredRecipes
                : filteredRecipes.slice(0, 8)
              ).map((recipe) => (
                <div key={recipe.id} className="chef-recipe-card">
                  <div
                    className="chef-recipe-image"
                    style={{ backgroundImage: `url(${recipe.image_url})` }}
                  />
                  <div className="chef-recipe-footer">
                    <h3 className="chef-recipe-title">{recipe.title}</h3>
                  </div>

                  <Link
                    to={`/food/${recipe.id}`}
                    className="chef-view-recipe-btn"
                  >
                    View Recipe
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChefDashboard;
