import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ViewRecipeAdmin.css";
import Sidebar from "../../sidebar/index.jsx";
import useApi from "../../../../api/index.jsx";

const ViewRecipeAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchData } = useApi();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetchData(`recipes?id=${id}`);

        if (response?.ok) {
          const result = await response.json();
          setRecipe(result?.data || null);
        } else {
          setError(`Error: ${response?.status}`);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch recipe details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleGoBack = () => {
    navigate("/manageRecipeAdmin");
  };

  const renderListItems = (items) => {
    if (!items) return <li>No items provided</li>;

    if (typeof items === "string") {
      return items
        .split("\n")
        .filter((line) => line.trim())
        .map((item, index) => <li key={index}>{item}</li>);
    }

    return <li>Invalid format</li>;
  };

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <Sidebar />
        <div className="admin-main-content">
          <div className="view-recipe-loading">Loading recipe...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-container">
        <Sidebar />
        <div className="admin-main-content">
          <div className="view-recipe-error">
            <h2>Error</h2>
            <p>{error}</p>
            <button
              onClick={handleGoBack}
              className="admin-back-button admin-back-button-red"
            >
              Back to Manage Recipes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="admin-dashboard-container">
        <Sidebar />
        <div className="admin-main-content">
          <div className="view-recipe-container">
            Recipe data could not be loaded.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <Sidebar />
      <div className="admin-main-content">
        <div className="view-recipe-container">
          <h1>{recipe.title}</h1>

          <div className="recipe-meta-info">
            <span>Cuisine: {recipe.cuisine_id}</span>
          </div>

          <div className="title-underline"></div>

          {recipe.image_url && (
            <div className="recipe-image-container">
              <img
                src={recipe.image_url}
                alt={`View of ${recipe.title}`}
                className="recipe-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/600x400?text=NO+IMAGE";
                }}
              />
            </div>
          )}

          <div className="recipe-description">
            <h3>Description</h3>
            <p>{recipe.description}</p>
          </div>

          <div className="recipe-details-columns">
            <div className="ingredients-section">
              <h3>Ingredients</h3>
              <ul>{renderListItems(recipe.ingredients)}</ul>
            </div>

            <div className="instructions-section">
              <h3>Instructions</h3>
              <ol>{renderListItems(recipe.recipe)}</ol>
            </div>
          </div>

          <button
            onClick={handleGoBack}
            className="admin-back-button admin-back-button-red admin-bottom-back-button"
          >
            ← Back to Manage Recipes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewRecipeAdmin;