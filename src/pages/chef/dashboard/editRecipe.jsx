import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import data from "../../../data/data.js";
import "./editRecipe.css";

const EditRecipe = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [recipeData, setRecipeData] = useState({
    title: "",
    prepared_by: "",
    rating: "",
    cuisine: "",
    description: "",
    ingredients: "",
    instructions: "",
    recipe_photo: "",
    category: "",
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    const foundRecipe = data.foods.find((recipe) => recipe.id === id);
    if (foundRecipe) {
      setRecipeData({
        ...foundRecipe,

        ingredients: Array.isArray(foundRecipe.ingredients)
          ? foundRecipe.ingredients.join("\n")
          : foundRecipe.ingredients || "",

        instructions: Array.isArray(foundRecipe.instructions)
          ? foundRecipe.instructions.join("\n")
          : foundRecipe.instructions || "",
      });
    } else {
      setError(`Recipe with ID "${id}" not found.`);
    }
    setLoading(false);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRecipeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    const updatedRecipe = {
      ...recipeData,

      ingredients: recipeData.ingredients.split("\n").filter((i) => i.trim()),

      instructions: recipeData.instructions.split("\n").filter((i) => i.trim()),
    };

    const index = data.foods.findIndex((recipe) => recipe.id === id);
    if (index !== -1) {
      data.foods[index] = updatedRecipe;
      console.log("Recipe updated:", updatedRecipe);
      navigate("/manageRecipe");
    } else {
      console.error("Failed to find recipe index for saving.");
      setError("Error saving recipe: Original recipe not found.");
    }
  };

  if (loading) return <div className="editingRecipeLoadingSpinner"></div>;

  if (error) {
    return (
      <div className="editingRecipeContainer">
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        <button
          onClick={() => navigate("/manageRecipe")}
          className="editingRecipeCancelButton"
          style={{ display: "block", margin: "20px auto" }}
        >
          Back to Manage Recipes
        </button>
      </div>
    );
  }

  return (
    <div className="editingRecipeContainer">
      <div className="editingRecipeHeader">
        <h1>Edit Recipe</h1>
      </div>

      <div className="editingRecipeMainInfo">
        <div className="editingRecipeFormGroup">
          <label>Recipe Title</label>
          <input
            type="text"
            name="title"
            value={recipeData.title}
            onChange={handleChange}
            placeholder="e.g. Samey Baji Set"
          />
        </div>

        <div className="editingRecipePillsRow">
          <div className="editingRecipeFormGroup pill-group">
            <label>Chef Name</label>
            <input
              type="text"
              name="prepared_by"
              value={recipeData.prepared_by}
              onChange={handleChange}
              placeholder="e.g. Abin"
            />
          </div>
          <div className="editingRecipeFormGroup pill-group">
            <label>Rating (1-5)</label>
            <input
              type="number"
              name="rating"
              min="1"
              max="5"
              step="0.1"
              value={recipeData.rating}
              onChange={handleChange}
              placeholder="4.5"
            />
          </div>
          <div className="editingRecipeFormGroup pill-group">
            <label>Cuisine</label>
            <input
              type="text"
              name="cuisine"
              value={recipeData.cuisine}
              onChange={handleChange}
              placeholder="e.g. Nepali"
            />
          </div>
          <div className="editingRecipeFormGroup pill-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={recipeData.category}
              onChange={handleChange}
              placeholder="e.g. Traditional"
            />
          </div>
        </div>

        <div className="editingRecipeFormGroup description-group">
          <label>Description</label>
          <textarea
            name="description"
            value={recipeData.description}
            onChange={handleChange}
            placeholder="Brief description of your recipe..."
            rows="4"
          />
        </div>
      </div>

      <div className="editingRecipeImageSection">
        <div className="editingRecipeFormGroup">
          <label>Image URL</label>
          <input
            type="text"
            name="recipe_photo"
            value={recipeData.recipe_photo}
            onChange={handleChange}
            placeholder="Paste image URL here"
          />

          {recipeData.recipe_photo && (
            <div className="editingRecipeImagePreview">
              <img src={recipeData.recipe_photo} alt="Recipe preview" />
            </div>
          )}
        </div>
      </div>

      <div className="editingRecipeDetailsColumns">
        <div className="editingRecipeIngredientsSection">
          <div className="editingRecipeFormGroup">
            <label>Ingredients (one per line)</label>
            <textarea
              name="ingredients"
              value={recipeData.ingredients}
              onChange={handleChange}
              placeholder="Beaten rice\nFried meat\nPickles\n..."
              rows="12"
            />
          </div>
        </div>

        <div className="editingRecipeInstructionsSection">
          <div className="editingRecipeFormGroup">
            <label>Instructions (step by step)</label>
            <textarea
              name="instructions"
              value={recipeData.instructions}
              onChange={handleChange}
              placeholder="1. Wash beaten rice...\n2. Marinate meat...\n..."
              rows="12"
            />
          </div>
        </div>
      </div>

      <div className="editingRecipeActions">
        <button
          onClick={() => navigate("/manageRecipe")}
          className="editingRecipeCancelButton"
        >
          ✕ Cancel
        </button>

        <button onClick={handleSave} className="editingRecipeSaveButton">
          ✓ Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditRecipe;
