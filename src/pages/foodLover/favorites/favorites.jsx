import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./favorites.css";
import data from "../../../data/data";
import Sidebar from "../sidebar";
import useApi from "../../../api";
import { toast } from "react-toastify";

const Favorites = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchData, postData } = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const initialFavoriteIds = ["1", "2", "3", "4", "5", "6"];

  const [ratings, setRatings] = useState({});

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData("favorites");

      if (response?.ok) {
        const result = await response.json();
        setFavorites(result?.data?.items);
      } else {
        setError(response?.status);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (recipeId) => {
    const dataToBePosted = {
      recipe_id: recipeId,
      is_favorite: false,
    };

    try {
      setIsLoading(true);
      const response = await postData("favorites", dataToBePosted);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        fetchFavorites();
        toast.success("Recipe removed from favorites successfully!");
      }
    } catch (err) {
      console.log(err);
      toast.error(`Error removing from favorites: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingChange = (recipeId, newRating) => {
    setRatings((prev) => ({
      ...prev,
      [recipeId]: newRating,
    }));
    console.log(`User rated recipe ${recipeId} as ${newRating} stars.`);
  };

  const renderRatingStars = (recipeId) => {
    const currentRating =
      ratings[recipeId] ||
      parseFloat(favorites.find((r) => r.id === recipeId)?.rating || 0);

    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        className={`fav-star ${star <= currentRating ? "fav-filled" : ""}`}
        onClick={() => handleRatingChange(recipeId, star)}
        onMouseEnter={(e) => {
          if (!ratings[recipeId]) {
            const stars =
              e.currentTarget.parentNode.querySelectorAll(".fav-star");
            stars.forEach((el, idx) => {
              el.classList.remove("fav-hover");
              if (idx < star) {
                el.classList.add("fav-hover");
              }
            });
          }
        }}
        onMouseLeave={(e) => {
          if (!ratings[recipeId]) {
            const stars =
              e.currentTarget.parentNode.querySelectorAll(".fav-star");
            stars.forEach((el) => el.classList.remove("fav-hover"));
          }
        }}
        aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
      >
        ⭐
      </button>
    ));
  };

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate("/foodLoverDashboard", { replace: true });
    }
  };

  return (
    <div className="fav-page-container">
      <Sidebar />

      <div className="main-content">
        <div className="fav-list-container">
          <div className="fav-header">
            <h2>View Favorites</h2>
          </div>

          <div className="fav-recipe-grid">
            {favorites.length > 0 ? (
              favorites.map((recipe) => (
                <div key={recipe.id} className="fav-recipe-card">
                  <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="fav-recipe-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-food.jpg";
                    }}
                  />

                  <div className="fav-recipe-content-wrapper">
                    <div className="fav-recipe-rating">
                      {renderRatingStars(recipe.id)}
                    </div>

                    <div className="fav-recipe-footer">
                      <h3 className="fav-recipe-title">{recipe.title}</h3>

                      <button
                        className="fav-favorite-btn fav-favorited"
                        onClick={() => {
                          handleRemoveFavorite(recipe.id);
                        }}
                        aria-label="Remove from favorites"
                      >
                        ❤️
                      </button>
                    </div>

                    <Link
                      to={`/food/${recipe.id}`}
                      className="fav-view-recipe-btn"
                      aria-label={`View ${recipe.title} recipe`}
                    >
                      View Recipe
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-favorites-container">
                <p className="no-favorites">
                  You haven't added any favorites yet, or you've removed them
                  all.
                </p>
                <button
                  className="explore-recipes-btn"
                  onClick={() => navigate("/foodLoverDashboard")}
                >
                  Explore Recipes
                </button>
              </div>
            )}
          </div>

          {initialFavoriteIds.length > 0 && (
            <div className="fav-back-button-container">
              <button
                className="fav-back-button"
                onClick={handleBack}
                aria-label="Go back"
              >
                <span className="back-button-icon">←</span> Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
