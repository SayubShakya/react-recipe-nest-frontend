import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaImage,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../sidebar";
import useApi from "../../../api/index.jsx";
import AddCuisineModal from "./addCuisine/index.jsx";
import EditCuisineModal from "./editCuisine/index.jsx";
import DeleteCuisineModal from "./deleteCuisine/index.jsx";
import "./manageCuisine.css";

const ManageCuisine = () => {
  const [cuisines, setCuisines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cuisineToEdit, setCuisineToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cuisineToDelete, setCuisineToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  const { fetchData, postData, putData, deleteData } = useApi();

  const fetchCuisines = async () => {
    setIsFetching(true);
    setError(null);
    try {
      const response = await fetchData("cuisines");

      if (response?.ok) {
        const result = await response.json();
        setCuisines(result?.data?.items || []);
      } else {
        const errorText = response?.statusText || `Status: ${response.status}`;
        setError(`Failed to load cuisines. ${errorText}`);
        setCuisines([]);
      }
    } catch (err) {
      console.error("Network or other error fetching cuisines:", err);
      setError(`Failed to load cuisines: ${err.message || "Network error"}`);
      setCuisines([]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleOpenEditModal = (cuisine) => {
    setCuisineToEdit(cuisine);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (cuisine) => {
    setCuisineToDelete(cuisine);
    setIsDeleteModalOpen(true);
  };

  const handleCloseAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setCuisineToEdit(null);
    setIsDeleteModalOpen(false);
    setCuisineToDelete(null);
  };

  const addCuisineAPI = async (cuisineName, cuisineImageUrl) => {
    try {
      const response = await postData("cuisines", {
        name: cuisineName,
        image_url: cuisineImageUrl?.trim() ? cuisineImageUrl.trim() : null,
      });

      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData?.message || errorData?.error || errorMsg;
        } catch (jsonError) {}
        throw new Error(errorMsg);
      }
      return await response.json();
    } catch (err) {
      console.error("Error adding cuisine:", err);
      throw err;
    }
  };

  const editCuisineAPI = async (cuisineId, cuisineName, cuisineImageUrl) => {
    try {
      const response = await putData(`cuisines`, {
        id: cuisineId,
        name: cuisineName,
        image_url: cuisineImageUrl?.trim() ? cuisineImageUrl.trim() : null,
      });

      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData?.message || errorData?.error || errorMsg;
        } catch (jsonError) {}
        throw new Error(errorMsg);
      }
      return await response.json();
    } catch (err) {
      console.error("Error editing cuisine:", err);
      throw err;
    }
  };

  const deleteCuisineAPI = async (cuisineId) => {
    try {
      const response = await deleteData(`cuisines?id=${cuisineId}`);

      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData?.message || errorData?.error || errorMsg;
        } catch (jsonError) {}
        throw new Error(errorMsg);
      }
      if (response.status === 204) {
        return { success: true };
      }
      return await response.json();
    } catch (err) {
      console.error("Error deleting cuisine:", err);
      throw err;
    }
  };

  const handleAddCuisine = async (cuisineName, cuisineImageUrl) => {
    setIsLoading(true);
    try {
      await addCuisineAPI(cuisineName, cuisineImageUrl);
      toast.success(`Cuisine "${cuisineName}" added successfully`);
      handleCloseAllModals();
      await fetchCuisines(); // Refresh data after success
    } catch (err) {
      toast.error(`Error adding cuisine: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCuisine = async (cuisineData) => {
    const { id, name, image_url } = cuisineData;
    setIsLoading(true);
    try {
      await editCuisineAPI(id, name, image_url);
      toast.success(`Cuisine "${name}" updated successfully`);
      handleCloseAllModals();
      await fetchCuisines(); // Refresh data after success
    } catch (err) {
      toast.error(`Error updating cuisine: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCuisine = async (cuisineId) => {
    setIsLoading(true);
    try {
      await deleteCuisineAPI(cuisineId);
      toast.success(`Cuisine deleted successfully`);
      handleCloseAllModals();
      await fetchCuisines(); // Refresh data after success
    } catch (err) {
      toast.error(`Error deleting cuisine: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCuisines = Array.isArray(cuisines)
    ? cuisines.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalItems = Array.isArray(cuisines) ? cuisines.length : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    fetchCuisines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Removed useEffect that watched modal states

  return (
    <>
      <div className="admin-dashboard-container">
        <Sidebar />
        <div className="admin-main-content">
          <div className="mc-container">
            <h1 className="mc-title">Manage Cuisine</h1>

            {isFetching && cuisines.length === 0 && (
              <div className="mc-loading-overlay">
                <FaSpinner className="mc-spinner" />
                <p>Loading cuisines...</p>
              </div>
            )}

            {error && !isFetching && (
              <div className="mc-error-message">
                <p>{error}</p>
                <button
                  onClick={fetchCuisines}
                  className="mc-btn mc-btn-retry"
                  disabled={isFetching}
                >
                  Retry
                </button>
              </div>
            )}

            {!error && (
              <div className="mc-table-container">
                <div className="mc-table-header">
                  <button
                    onClick={handleOpenAddModal}
                    className="mc-add-cuisine-btn"
                    disabled={isLoading || isFetching}
                  >
                    <FaPlus /> Add Cuisine
                  </button>
                </div>

                <div className="mc-table-wrapper">
                  <table className="mc-table">
                    <thead>
                      <tr>
                        <th style={{ width: "80px", textAlign: "center" }}>
                          Image
                        </th>
                        <th>Cuisine Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isFetching && currentCuisines.length === 0 && (
                        <tr>
                          <td colSpan="3" className="mc-loading-cell">
                            <FaSpinner className="mc-spinner-inline" />{" "}
                            Loading...
                          </td>
                        </tr>
                      )}
                      {!isFetching && currentCuisines.length > 0
                        ? currentCuisines.map((cuisine) => (
                            <tr key={cuisine.id}>
                              <td
                                data-label="Image"
                                style={{
                                  textAlign: "center",
                                  verticalAlign: "middle",
                                }}
                              >
                                {cuisine.image_url ? (
                                  <img
                                    src={cuisine.image_url}
                                    alt={cuisine.name || "Cuisine Image"}
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      objectFit: "cover",
                                      borderRadius: "4px",
                                      display: "inline-block",
                                      verticalAlign: "middle",
                                    }}
                                    onError={(e) => {
                                      const imgElement = e.currentTarget;
                                      const placeholder =
                                        imgElement.nextSibling;
                                      imgElement.style.display = "none";
                                      if (
                                        placeholder &&
                                        placeholder.tagName === "svg"
                                      ) {
                                        placeholder.style.display =
                                          "inline-block";
                                      }
                                    }}
                                  />
                                ) : null}
                                <FaImage
                                  style={{
                                    display: !cuisine.image_url
                                      ? "inline-block"
                                      : "none",
                                    fontSize: "1.8rem",
                                    color: "#ccc",
                                    verticalAlign: "middle",
                                  }}
                                  aria-label="No image available"
                                />
                              </td>
                              <td data-label="Cuisine Name">{cuisine.name}</td>
                              <td
                                data-label="Actions"
                                className="mc-action-buttons"
                              >
                                <button
                                  title={`Edit cuisine: ${cuisine.name}`}
                                  className="mc-action-btn mc-action-btn--edit"
                                  onClick={() => handleOpenEditModal(cuisine)}
                                  disabled={isLoading || isFetching}
                                >
                                  {" "}
                                  <FaEdit />{" "}
                                </button>
                                <button
                                  title={`Delete cuisine: ${cuisine.name}`}
                                  className="mc-action-btn mc-action-btn--delete"
                                  onClick={() => handleOpenDeleteModal(cuisine)}
                                  disabled={isLoading || isFetching}
                                >
                                  {" "}
                                  <FaTrash />{" "}
                                </button>
                              </td>
                            </tr>
                          ))
                        : !isFetching &&
                          totalItems === 0 && (
                            <tr>
                              <td colSpan="3" className="mc-no-data-cell">
                                No cuisines found. Add a new cuisine to get
                                started.
                              </td>
                            </tr>
                          )}
                    </tbody>
                  </table>
                </div>

                {totalItems > itemsPerPage && totalPages > 1 && (
                  <div className="mc-pagination">
                    <span className="mc-page-info">
                      Page {currentPage} of {totalPages} (Total: {totalItems})
                    </span>
                    <div className="mc-page-controls">
                      <button
                        className="mc-page-btn mc-page-btn--prev"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1 || isLoading || isFetching}
                        aria-label="Previous Page"
                      >
                        {" "}
                        <FaChevronLeft />{" "}
                      </button>
                      {[...Array(totalPages).keys()].map((num) => {
                        const pageNumber = num + 1;
                        const showPage =
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 &&
                            pageNumber <= currentPage + 1);

                        if (!showPage) {
                          if (
                            pageNumber === currentPage - 2 ||
                            pageNumber === currentPage + 2
                          ) {
                            return (
                              <span
                                key={`ellipsis-${pageNumber}`}
                                className="mc-page-ellipsis"
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        }
                        return (
                          <button
                            key={pageNumber}
                            aria-current={
                              currentPage === pageNumber ? "page" : undefined
                            }
                            className={`mc-page-btn mc-page-btn--number ${
                              currentPage === pageNumber
                                ? "mc-page-btn--active"
                                : ""
                            }`}
                            onClick={() => goToPage(pageNumber)}
                            disabled={isLoading || isFetching}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                      <button
                        className="mc-page-btn mc-page-btn--next"
                        onClick={handleNextPage}
                        disabled={
                          currentPage === totalPages || isLoading || isFetching
                        }
                        aria-label="Next Page"
                      >
                        {" "}
                        <FaChevronRight />{" "}
                      </button>
                    </div>
                  </div>
                )}

                <div className="mc-back-button-container">
                  <Link to="/adminDashboard" className="mc-back-btn">
                    {" "}
                    <FaArrowLeft /> Go back to dashboard{" "}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <AddCuisineModal
          onAdd={handleAddCuisine}
          onClose={handleCloseAllModals}
          isLoading={isLoading}
        />
      )}
      {isEditModalOpen && cuisineToEdit && (
        <EditCuisineModal
          cuisine={cuisineToEdit}
          onEdit={handleEditCuisine}
          onClose={handleCloseAllModals}
          isLoading={isLoading}
        />
      )}
      {isDeleteModalOpen && cuisineToDelete && (
        <DeleteCuisineModal
          cuisine={cuisineToDelete}
          onDelete={handleDeleteCuisine}
          onClose={handleCloseAllModals}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default ManageCuisine;
