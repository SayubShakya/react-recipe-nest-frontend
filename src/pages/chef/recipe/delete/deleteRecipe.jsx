import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 

import "./DeleteRecipe.css";
import useApi from "../../../../api";

const DeleteRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams(); 
  const navigate = useNavigate();
  const { fetchData, deleteData } = useApi();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const response = await fetchData("recipes");

        if (response?.ok) {
          const result = await response.json();
          const allRecipes = result?.data?.items || [];
          setRecipes(allRecipes);
          const targetRecipe = allRecipes.find((r) => r.id === id);
          setRecipeToDelete(targetRecipe);
        } else {
          setError(response?.status);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch recipes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id, fetchData]);

  const deleteRecipeAPI = async (recipeId) => {
    try {
      setIsLoading(true);
      const response = await deleteData(`recipes?id=${recipeId}`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      toast.success("Recipe deleted successfully");
      navigate("/manageRecipe");
    } catch (err) {
      console.error(err);
      toast.error(`Error deleting recipe: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecipe = () => {
    if (recipeToDelete?.id) deleteRecipeAPI(recipeToDelete.id);
  };

  const handleCancel = () => {
    navigate("/manageRecipe");
  };

  if (isLoading) {
    return (
      <div className="delete-recipe-loading">Loading recipe details...</div>
    );
  }

  if (error) {
    return (
      <div className="delete-recipe-error">
        <p>Error</p>
        <p>{error}</p>
        <button onClick={handleCancel} className="cancel-button">
          Back to Manage Recipes
        </button>
      </div>
    );
  }

  if (!recipeToDelete) {
    return (
      <div className="delete-recipe-container">Recipe data not available.</div>
    );
  }

  return (
    <div className="delete-recipe-container">
      <h1>Confirm Recipe Deletion</h1>
      <p>
        You are about to permanently delete the following recipe. Please review
        the details below before confirming.
      </p>

      <div className="delete-recipe-info">
        <h2>{recipeToDelete.title}</h2>
        <p>
          <strong>Cuisine:</strong> {recipeToDelete.cuisine}
        </p>
        <p>
          <strong>Category:</strong> {recipeToDelete.category}
        </p>

        {recipeToDelete.recipe_photo && (
          <div className="delete-recipe-image-preview">
            <img
              src={recipeToDelete.recipe_photo}
              alt={`Preview of ${recipeToDelete.title}`}
            />
          </div>
        )}

        <p className="delete-recipe-description">
          {recipeToDelete.description}
        </p>
      </div>

      <div className="delete-warning">
        <strong>Warning:</strong> This action cannot be undone. Once deleted,
        the recipe data will be lost permanently.
      </div>

      <div className="delete-actions">
        <button onClick={handleCancel} className="cancel-button">
          Cancel
        </button>
        <button onClick={handleDeleteRecipe} className="confirm-delete-button">
          Confirm Delete Recipe
        </button>
      </div>
    </div>
  );
};

export default DeleteRecipe;
