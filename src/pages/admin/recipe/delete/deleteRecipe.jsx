import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DeleteRecipeAdmin.css";
import Sidebar from "../../sidebar/index.jsx";
import useApi from "../../../../api/index.jsx";
import { toast } from "react-toastify";

const DeleteRecipeAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchData, deleteData } = useApi();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteData(`recipes?id=${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      toast.success("Recipe deleted successfully");
      navigate("/manageRecipeAdmin");
    } catch (err) {
      console.error(err);
      toast.error(`Error deleting recipe: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate("/manageRecipeAdmin");
  };

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <Sidebar />
        <div className="admin-main-content">
          <div className="delete-recipe-loading">Loading recipe details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-container">
        <Sidebar />
        <div className="admin-main-content">
          <div className="delete-recipe-error">
            <p>Error</p>
            <p>{error}</p>
            <button onClick={handleCancel} className="admin-cancel-button">
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
          <div className="delete-recipe-container">
            Recipe data not available.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <Sidebar />
      <div className="admin-main-content">
        <div className="delete-recipe-container">
          <h1>Confirm Recipe Deletion</h1>
          <p>
            You are about to permanently delete the following recipe. Please
            review the details below before confirming.
          </p>

          <div className="delete-recipe-info">
            <h2>{recipe.title}</h2>
            <p>
              <strong>Cuisine:</strong> {recipe.cuisine_id}
            </p>

            {recipe.image_url && (
              <div className="delete-recipe-image-preview">
                <img
                  src={recipe.image_url}
                  alt={`Preview of ${recipe.title}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x400?text=NO+IMAGE";
                  }}
                />
              </div>
            )}

            <p className="delete-recipe-description">{recipe.description}</p>
          </div>

          <div className="delete-warning">
            <strong>Warning:</strong> This action cannot be undone. Once
            deleted, the recipe data will be lost permanently.
          </div>

          <div className="delete-actions">
            <button
              onClick={handleCancel}
              className="admin-cancel-button"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="admin-confirm-delete-button"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Confirm Delete Recipe"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteRecipeAdmin;
