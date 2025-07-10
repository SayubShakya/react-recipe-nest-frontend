import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./style.css";
import data from "../../../data/data";
import Sidebar from "../sidebar";
import useApi from "../../../api";
import { toast } from "react-toastify";

import Favorites from "./../favorites/favorites";

const FoodLoverDashboard = () => {
  const currentLoggedInUser = JSON.parse(sessionStorage.getItem("user"));

  const { fetchData, postData } = useApi();

  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [refetch, setRefetch] = useState(false);

  const [showAllRecipes, setShowAllRecipes] = useState(false);

  const [filteredRecipes, setFilteredRecipes] = useState(data.foods);
  const [recipes, setRecipes] = useState([]);

  const [filters, setFilters] = useState({
    cuisine: "",
    category: "",
    dietary: "",
  });

  const [ratings, setRatings] = useState(() => {
    const savedRatings = localStorage.getItem("recipeRatings");
    return savedRatings ? JSON.parse(savedRatings) : {};
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
    const filtered = data.foods.filter(
      (recipe) =>
        (filters.cuisine === "" || recipe.cuisine === filters.cuisine) &&
        (filters.category === "" || recipe.category === filters.category) &&
        (filters.dietary === "" || recipe.dietary === filters.dietary)
    );
    setFilteredRecipes(filtered);
  }, [filters]);

  useEffect(() => {
    localStorage.setItem("recipeRatings", JSON.stringify(ratings));
    // toast.success("Rating saved successfully!");
  }, [ratings]);

  const handleFilterChange = (e, type) => {
    setFilters((prev) => ({ ...prev, [type]: e.target.value }));
    toast.info(`Filtered by ${type}: ${e.target.value || "none"}`);
  };

  const handleRating = (recipeId, rating) => {
    setRatings((prev) => ({ ...prev, [recipeId]: rating }));
  };

  const renderStars = (recipeId, defaultRating) => {
    const currentRating = ratings[recipeId] || 0;

    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`star ${star <= currentRating ? "filled" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleRating(recipeId, star);
        }}
        title={`Rate ${star} star${star > 1 ? "s" : ""}`}
      >
        {star <= currentRating ? "★" : "☆"}
      </span>
    ));
  };

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);

      const response = await fetchData("recipes");

      if (response?.ok) {
        const result = await response.json();
        setRecipes(result?.data?.items);
      } else {
        setError(response?.status);
        toast.error(`Failed to load recipes: ${response?.status}`);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error loading recipes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);

      const response = await fetchData("favorites");

      if (response?.ok) {
        const result = await response.json();
        setFavorites(result?.data?.items);
      } else {
        setError(response?.status);
        toast.error(`Failed to load favorites: ${response?.status}`);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error loading favorites. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
    fetchFavorites();
  }, []);

  const getFavorites = (id) => {
    const myFavorites = favorites.filter((item) => item.id === id);
    return myFavorites.length > 0;
  };

  const toggleFavorite = async (recipeId) => {
    const alreadyFavorited = getFavorites(recipeId);

    const dataToBePosted = {
      recipe_id: recipeId,
      is_favorite: !alreadyFavorited,
    };

    try {
      setIsLoading(true);

      const response = await postData("favorites", dataToBePosted);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        fetchRecipes();
        fetchFavorites();
        toast.success(
          alreadyFavorited ? "Removed from favorites!" : "Added to favorites!"
        );
      }

      return await response.json();
    } catch (err) {
      console.log(err);
      toast.error(`Error updating favorites: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <div className="header">
          <div className="date-bar">
            <div className="welcome-text">
              <h1>Welcome, {currentLoggedInUser?.name || ""}!</h1>
            </div>
            <br />
            <span className="today-tag">📅 Today</span>
            <span className="date">{currentDate}</span>
          </div>

          <div className="filters">
            <div className="filter">
              <select
                className="filter-dropdown"
                onChange={(e) => handleFilterChange(e, "cuisine")}
                value={filters.cuisine}
              >
                <option value="">Filter by cuisine</option>

                {[...new Set(data.foods.map((f) => f.cuisine))]
                  .sort()
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>

            <div className="filter">
              <select
                className="filter-dropdown"
                onChange={(e) => handleFilterChange(e, "category")}
                value={filters.category}
              >
                <option value="">Filter by category</option>
                {[...new Set(data.foods.map((f) => f.category))]
                  .sort()
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>
            <div className="filter">
              <select
                className="filter-dropdown"
                onChange={(e) => handleFilterChange(e, "dietary")}
                value={filters.dietary}
              >
                <option value="">Filter by dietary restrictions</option>
                {[...new Set(data.foods.map((f) => f.dietary))]
                  .sort()
                  .map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        <div className="recipes-section">
          <div className="section-header">
            <h2>Recipes</h2>

            <button
              className="view-all"
              onClick={() => {
                setShowAllRecipes(!showAllRecipes);
              }}
            >
              {showAllRecipes ? "Show Less" : "View All"}
            </button>
          </div>
          {!!isLoading ? (
            <p>Loading...</p>
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
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/600x400?text=NO+IMAGE";
                            toast.warn(
                              "Recipe image not found, using placeholder"
                            );
                          }}
                        />
                      </Link>

                      <button
                        className={`favorite-btn ${
                          getFavorites(recipe.id) ? "favorited" : ""
                        }`}
                        onClick={() => {
                          toggleFavorite(recipe.id);
                          setRefetch(true);
                        }}
                        aria-label={
                          getFavorites(recipe.id)
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                        title={
                          getFavorites(recipe.id)
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        {!getFavorites(recipe.id) ? "🤍" : "❤️"}
                      </button>
                    </div>

                    <Link
                      to={`/food/${recipe.id}`}
                      className="recipe-title-link"
                    >
                      <h3 className="recipe-title" title={recipe.title}>
                        {recipe.title}
                      </h3>
                    </Link>

                    <div className="recipe-rating">
                      {renderStars(recipe.id, recipe.rating || 0)}
                    </div>
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

export default FoodLoverDashboard;
