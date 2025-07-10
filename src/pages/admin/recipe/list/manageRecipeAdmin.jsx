import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageRecipeAdmin.css";
import Sidebar from "../../sidebar/index.jsx";
import useApi from "../../../../api/index.jsx";

const ManageRecipeAdmin = () => {
  const { fetchData, deleteData } = useApi();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 6;

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

  const handleAddRecipe = () => {
    navigate("/createRecipeAdmin");
  };

  const handleEdit = (id) => {
    navigate(`/editRecipeAdmin/${id}`);
  };

  const handleDelete = async (id) => {
    await deleteData(`recipes?id=${id}`);
    fetchRecipes();
  };

  const handleView = (id) => {
    navigate(`/viewRecipeAdmin/${id}`);
  };

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="admin-dashboard-container">
      <Sidebar />
      <div className="admin-main-content">
        <div className="admin-recipe-management">
          <div className="admin-recipe-header">
            <h2 className="admin-page-title">Manage Recipe</h2>
            <button
              className="admin-add-recipe-button admin-button-green"
              onClick={handleAddRecipe}
            >
              Add new recipe detail
            </button>
          </div>

          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="admin-table-container">
              <table className="admin-recipe-table">
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" />
                    </th>
                    <th>Photo</th>
                    <th>Title</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecipes.map((recipe) => (
                    <tr key={recipe.id}>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td className="admin-recipe-image-cell">
                        <img
                          src={recipe.image_url || "https://placehold.co/100x100?text=No+Image"}
                          alt={recipe.title}
                          className="admin-recipe-thumbnail"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/100x100?text=No+Image";
                          }}
                        />
                      </td>
                      <td>{recipe.title}</td>
                      <td className="admin-action-buttons">
                        <button
                          className="admin-edit-button admin-button-blue"
                          onClick={() => handleEdit(recipe.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-delete-button admin-button-red"
                          onClick={() => handleDelete(recipe.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="admin-view-button admin-button-yellow"
                          onClick={() => handleView(recipe.id)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {recipes.length > recipesPerPage && (
            <div className="admin-pagination">
              <div className="admin-pagination-controls">
                <button
                  className="admin-pagination-arrow"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {[...Array(totalPages).keys()].map((number) => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`admin-pagination-number ${
                      currentPage === number + 1 ? "admin-page-active" : ""
                    }`}
                  >
                    {number + 1}
                  </button>
                ))}
                <button
                  className="admin-pagination-arrow"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageRecipeAdmin;