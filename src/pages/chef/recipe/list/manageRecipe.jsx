import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ManageRecipe.css";
import Sidebar from "../../sidebar/index.jsx";
import useApi from "../../../../api/index.jsx";

const ManageRecipe = () => {
  const currentLoggedInUser = JSON.parse(sessionStorage.getItem("user"));
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
    navigate("/createRecipe");
  };

  const handleEdit = (id) => {
    navigate(`/editRecipe/${id}`);
  };

  const handleDelete = async (id) => {
    console.log(id);
    const data = await deleteData(`recipes?id=${id}`).then((json) => {
      fetchRecipes();
    });
  };

  const handleView = (id) => {
    navigate(`/viewRecipe/${id}`);
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
    <div className="chef-dashboard-container">
      <Sidebar />
      <div className="chef-main-content">
        <div className="chef-recipe-management">
          <div className="chef-recipe-header">
            <h2 className="chef-page-title">Manage Recipe</h2>
            <button
              className="chef-add-recipe-button chef-button-green"
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
            <div className="chef-table-container">
              <table className="chef-recipe-table">
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
                      <td className="chef-recipe-image-cell">
                        <img
                          src={recipe.image_url}
                          alt={recipe.title}
                          className="chef-recipe-thumbnail"
                        />
                      </td>
                      <td>{recipe.title}</td>
                      <td className="chef-action-buttons">
                        <button className="chef-delete-button chef-button-blue">
                          <Link
                            key="Edit"
                            to={"/createRecipe/" + recipe.id}
                            style={{ textDecoration: "none", color: "white" }}
                          >
                            Edit
                          </Link>
                        </button>

                        <button
                          className="chef-delete-button chef-button-red"
                          onClick={() => handleDelete(recipe.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="chef-view-button chef-button-yellow"
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
            <div className="chef-pagination">
              <div className="chef-pagination-controls">
                <button
                  className="chef-pagination-arrow"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {[...Array(totalPages).keys()].map((number) => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`chef-pagination-number ${
                      currentPage === number + 1 ? "chef-page-active" : ""
                    }`}
                  >
                    {number + 1}
                  </button>
                ))}
                <button
                  className="chef-pagination-arrow"
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

export default ManageRecipe;
