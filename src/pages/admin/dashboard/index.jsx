import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./adminDashboard.css";
import Sidebar from "../sidebar";
import useApi from "../../../api";

const AdminDashboard = () => {
  const currentLoggedInUser = JSON.parse(sessionStorage.getItem("user"));
  const { fetchData } = useApi();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [showAllRecipes, setShowAllRecipes] = useState(false);
  const [recipes, setRecipes] = useState([]);

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

  return (
    <div className="admin-dashboard-container">
      <Sidebar />

      <div className="admin-main-content">
        <div className="admin-header">
          <div className="admin-welcome-banner">
            <div className="admin-welcome-text">
              <h1>
                Welcome, {currentLoggedInUser?.name || ""}! Lead with vision and
                efficiency. 🚀
              </h1>
              <p>Leadership in Action, Excellence in Management</p>
            </div>
          </div>
        </div>

        <div className="recipes-section">
          <div className="section-header">
            <h2>View Recipe Portfolio</h2>
            <button
              className="view-all"
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
            <div className="recipes-grid">
              {(showAllRecipes ? recipes : recipes.slice(0, 8)).map(
                (recipe) => (
                  <div key={recipe.id} className="recipe-card">
                    <div className="recipe-image-container">
                      <Link
                        to={`/food/${recipe.id}`}
                        className="recipe-image-link"
                      >
                        <img
                          src={recipe.image_url}
                          alt={recipe.title}
                          className="recipe-image"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "https://placehold.co/600x400?text=NO+IMAGE";
                          }}
                        />
                      </Link>
                    </div>

                    <Link
                      to={`/food/${recipe.id}`}
                      className="recipe-title-link"
                    >
                      <h3 className="recipe-title" title={recipe.title}>
                        {recipe.title}
                      </h3>
                    </Link>

                    <br />

                    <Link to={`/food/${recipe.id}`} className="view-recipe-btn">
                      View Recipe
                    </Link>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
