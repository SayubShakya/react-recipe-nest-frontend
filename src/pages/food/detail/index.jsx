import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../../../api/index";
import "./FoodDetail.css";

const FoodDetail = () => {
  const { id } = useParams();
  const [foodDetail, setFoodDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const { fetchData } = useApi();

  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        setLoading(true);
        const response = await fetchData(`recipes?id=${id}`);

        if (response?.ok) {
          const result = await response.json();
          setFoodDetail(result?.data || null);
        } else {
          setError("Recipe not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch recipe details");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetail();
  }, [id]);

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your delicious recipe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>{error}</h2>
        <p>Sorry, we couldn't find the recipe you're looking for.</p>
        <Link to="/" className="back-button">
          Return to home
        </Link>
      </div>
    );
  }

  if (!foodDetail) {
    return (
      <div className="error-container">
        <h2>Recipe not found</h2>
        <p>Sorry, we couldn't find the recipe you're looking for.</p>
        <Link to="/" className="back-button">
          Return to home
        </Link>
      </div>
    );
  }

  const renderListItems = (items) => {
    if (!items) return null;

    if (Array.isArray(items)) {
      return items.map((item, index) => <li key={index}>{item}</li>);
    }

    if (typeof items === "string") {
      return items
        .split("\n")
        .map((item, index) => <li key={index}>{item.trim()}</li>);
    }

    return null;
  };

  return (
    <div className="food-detail-container">
      <div className="recipe-header">
        <h1>{foodDetail.title}</h1>
        <div className="recipe-meta">
          <span className="cuisine">Cuisine: {foodDetail.cuisine_id}</span>
        </div>
      </div>

      <div className="recipe-image-container">
        {!imageError && foodDetail.image_url ? (
          <img
            src={foodDetail.image_url}
            alt={foodDetail.title}
            onError={handleImageError}
          />
        ) : (
          <div className="recipe-image-placeholder">
            <span>No Image Available</span>
          </div>
        )}
      </div>

      <div className="recipe-content">
        <div className="recipe-description">
          <h2>Description</h2>
          <p>{foodDetail.description}</p>
        </div>

        <div className="recipe-details">
          <div className="ingredients-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {renderListItems(foodDetail.ingredients)}
            </ul>
          </div>

          <div className="instructions-section">
            <h2>Instructions</h2>
            <ol className="instructions-list">
              {renderListItems(foodDetail.recipe)}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
