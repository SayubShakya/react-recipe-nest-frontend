import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./createRecipe.css";
import data from "../../../../data/data";
import Sidebar from "../../sidebar";
import useApi from "../../../../api";
import { toast } from "react-toastify";

const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchData, postData, putData } = useApi();
  const [error, setError] = useState(null);

  const initialFormData = {
    title: "",
    description: "",
    ingredients: "",
    recipe: "",
    cuisine_id: "",
    image_url: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(!!id);
  const [cuisines, setCuisines] = useState([]);

  useEffect(() => {
    if (id) {
      fetchData("recipes?id=" + id)
        .then((data) => data.json())
        .then((data) => {
          let recipe = data.data;
          console.log(recipe);
          setFormData({
            title: recipe.title || "",
            description: recipe.description || "",
            ingredients: recipe.ingredients || "",
            recipe: recipe.recipe || "",
            cuisine_id: recipe.cuisine_id || "",
            image_url: recipe.image_url || "",
          });
        });
    }
  }, [navigate]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (!formData.ingredients.trim())
      errors.ingredients = "Ingredients are required";
    if (!formData.recipe.trim()) errors.recipe = "Recipe is required";
    if (!formData.cuisine_id) errors.cuisine_id = "Cuisine is required";
    if (!formData.image_url.trim()) {
      errors.image_url = "Image URL is required";
    } else {
      try {
        new URL(formData.image_url);
      } catch (_) {
        errors.image_url = "Please enter a valid URL";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      formData["cuisine_id"] = +formData["cuisine_id"];
      if (id) {
        formData["id"] = +id;
        const response = await putData("recipes", formData);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        toast.success(`Recipe "${formData.title}" updated successfully`);
        navigate("/chefDashboard");
        return result;
      } else {
        const response = await postData("recipes", formData);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        toast.success(`Recipe "${formData.title}" created successfully`);
        navigate("/chefDashboard");
        return result;
      }
    } catch (err) {
      console.error(err);
      toast.error(`Error submitting Recipe: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCuisines = async () => {
    try {
      const response = await fetchData("cuisines");
      if (response?.ok) {
        const result = await response.json();
        setCuisines(result?.data?.items || []);
      } else {
        setError(response?.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCuisines();
  }, []);

  const editRoleAPI = async (roleId, roleName) => {
    try {
      setIsLoading(true);
      const response = await putData("roles", { id: roleId, name: roleName });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      handleCloseAllModals();
      toast.success(`Role "${roleName}" edited successfully`);

      return await response.json();
    } catch (err) {
      console.log(err);
      toast.error(`Error updating roles: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="chef-dashboard-container">
      <Sidebar />
      <div className="chef-main-content">
        <div className="chef-recipe-form">
          <h2 className="chef-form-title">
            {id ? "Edit Recipe Details" : "Add Recipe Details"}
          </h2>
          <form
            className="chef-recipe-form-content"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="chef-form-section">
              <label htmlFor="image_url" className="chef-section-title">
                Recipe Photo URL
              </label>
              {formData.image_url && (
                <div className="chef-image-url-preview">
                  <img
                    src={formData.image_url}
                    alt="Recipe Preview"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Invalid+URL";
                      if (!formErrors.image_url) {
                        setFormErrors((prev) => ({
                          ...prev,
                          image_url: "Image could not be loaded from URL",
                        }));
                      }
                    }}
                  />
                </div>
              )}
              <input
                id="image_url"
                type="text"
                name="image_url"
                placeholder="https://example.com/image.jpg"
                className={`chef-form-input ${
                  formErrors.image_url ? "input-error" : ""
                }`}
                value={formData.image_url}
                onChange={handleChange}
                required
              />
              {formErrors.image_url && (
                <p className="error-message">{formErrors.image_url}</p>
              )}
            </div>

            <div className="chef-form-section">
              <label htmlFor="title" className="chef-section-title">
                Enter Recipe Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="e.g., Delicious Spicy Chicken Curry"
                className={`chef-form-input ${
                  formErrors.title ? "input-error" : ""
                }`}
                value={formData.title}
                onChange={handleChange}
                required
              />
              {formErrors.title && (
                <p className="error-message">{formErrors.title}</p>
              )}
            </div>

            <div className="chef-form-section">
              <label htmlFor="description" className="chef-section-title">
                Enter Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Briefly describe the dish..."
                className={`chef-form-textarea ${
                  formErrors.description ? "input-error" : ""
                }`}
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
              />
              {formErrors.description && (
                <p className="error-message">{formErrors.description}</p>
              )}
            </div>

            <div className="chef-form-section">
              <label htmlFor="ingredients" className="chef-section-title">
                Add ingredients and quantities
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                placeholder={`e.g.,\n1 cup All-Purpose Flour\n2 large Eggs\n1 tsp Vanilla Extract`}
                className={`chef-form-textarea ${
                  formErrors.ingredients ? "input-error" : ""
                }`}
                rows="6"
                value={formData.ingredients}
                onChange={handleChange}
                required
              />
              {formErrors.ingredients && (
                <p className="error-message">{formErrors.ingredients}</p>
              )}
            </div>

            <div className="chef-form-section">
              <label htmlFor="recipe" className="chef-section-title">
                Write step-by-step instructions
              </label>
              <textarea
                id="recipe"
                name="recipe"
                placeholder={`e.g.,\n1. Preheat oven to 350°F (175°C).\n2. Mix dry ingredients.\n3. Add wet ingredients.`}
                className={`chef-form-textarea ${
                  formErrors.recipe ? "input-error" : ""
                }`}
                rows="8"
                value={formData.recipe}
                onChange={handleChange}
                required
              />
              {formErrors.recipe && (
                <p className="error-message">{formErrors.recipe}</p>
              )}
            </div>

            <div className="chef-form-row">
              <div className="chef-form-column">
                <label htmlFor="cuisine_id" className="chef-section-title">
                  Cuisine
                </label>
                <select
                  id="cuisine_id"
                  name="cuisine_id"
                  className={`chef-form-select ${
                    formErrors.cuisine_id ? "input-error" : ""
                  }`}
                  value={formData.cuisine_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select cuisine</option>
                  {cuisines.map((cuisine) => {
                    console.log(cuisine.id, formData.cuisine_id);
                    if (cuisine.id == formData.cuisine_id) {
                      return (
                        <option key={cuisine.id} value={cuisine.id} selected>
                          {cuisine.name}
                        </option>
                      );
                    } else {
                      return (
                        <option key={cuisine.id} value={cuisine.id}>
                          {cuisine.name}
                        </option>
                      );
                    }
                  })}
                </select>
                {formErrors.cuisine_id && (
                  <p className="error-message">{formErrors.cuisine_id}</p>
                )}
              </div>
            </div>

            <div className="chef-form-button-group">
              <button
                type="button"
                onClick={handleGoBack}
                className="chef-back-button"
              >
                Go Back
              </button>
              <button
                type="submit"
                className={`chef-submit-button ${
                  !id ? "chef-publish-button" : ""
                }`}
              >
                {id ? "Update Recipe" : "Publish Recipe"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecipeForm;
