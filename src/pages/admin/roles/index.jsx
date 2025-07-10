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
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./manageRoles.css";
import Sidebar from "../sidebar";
import { stringInReadabaleFormat } from "../../../helpers/index.js";
import useApi from "../../../api/index.jsx";
import AddRoleModal from "./addRole/index.jsx";
import EditRoleModal from "./editRole/index.jsx";
import DeleteRoleModal from "./deleteRole/index.jsx";

const ManageRoles = () => {
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { fetchData, postData, putData, deleteData } = useApi();

  const fetchRoles = async () => {
    try {
      setIsLoading(true);

      const response = await fetchData("roles");

      if (response?.ok) {
        const result = await response.json();
        setRoles(result?.data?.items);
      } else {
        setError(response?.status);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleOpenEditModal = (role) => {
    setRoleToEdit(role);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (role) => {
    if (role.name.toLowerCase() === "admin") {
      toast.warning("The core 'Admin' role cannot be deleted.");
      return;
    }
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const handleCloseAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setRoleToEdit(null);
    setIsDeleteModalOpen(false);
    setRoleToDelete(null);
  };

  const addRoleAPI = async (roleName) => {
    try {
      setIsLoading(true);

      const response = await postData("roles", { name: roleName });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      handleCloseAllModals();
      toast.success(`Role "${roleName}" added successfully`);
      return await response.json();
    } catch (err) {
      console.log(err);
      toast.error(`Error updating roles: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

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

  const deleteRoleAPI = async (roleId) => {
    try {
      setIsLoading(true);
      const response = await deleteData(`roles?id=${roleId}`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      handleCloseAllModals();
      toast.success(`Role  deleted successfully`);
      return await response.json();
    } catch (err) {
      console.log(err);
      toast.error(`Error updating roles: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRole = async (roleName) => {
    addRoleAPI(roleName);
  };

  const handleEditRole = async (roleId, newName) => {
    editRoleAPI(roleId, newName);
  };

  const handleDeleteRole = async (roleId) => {
    deleteRoleAPI(roleId);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoles = roles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(roles.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    (!isAddModalOpen || !isEditModalOpen || !isDeleteModalOpen) && fetchRoles();
  }, [isAddModalOpen, isEditModalOpen, isDeleteModalOpen]);

  return (
    <>
      <div className="admin-dashboard-container">
        <Sidebar />

        <div className="admin-main-content">
          <div className="mr-container">
            <h1 className="mr-title">Manage Roles</h1>

            {isLoading &&
              !isAddModalOpen &&
              !isEditModalOpen &&
              !isDeleteModalOpen && (
                <div className="mr-loading-overlay">
                  <FaSpinner className="mr-spinner" />
                  <p>Loading roles...</p>
                </div>
              )}

            {error && !isLoading && (
              <div className="mr-error-message">
                <p>Error: {error}</p>
                <button onClick={fetchRoles} className="mr-btn mr-btn-retry">
                  Retry
                </button>
              </div>
            )}

            <div className="mr-table-container">
              <div className="mr-table-header">
                <button
                  onClick={handleOpenAddModal}
                  className="mr-add-role-btn"
                  disabled={isLoading}
                >
                  <FaPlus /> Add Role
                </button>
              </div>

              <div className="mr-table-wrapper">
                <table className="mr-table">
                  <thead>
                    <tr>
                      <th>Role Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRoles.length > 0 ? (
                      currentRoles.map((role) => (
                        <tr key={role.id}>
                          <td data-label="Role Name">
                            {stringInReadabaleFormat(role.name)}
                          </td>
                          <td
                            data-label="Actions"
                            className="mr-action-buttons"
                          >
                            <button
                              title={`Edit role: ${role.name}`}
                              className="mr-action-btn mr-action-btn--edit"
                              onClick={() => handleOpenEditModal(role)}
                              disabled={isLoading}
                            >
                              <FaEdit />
                            </button>
                            <button
                              title={`Delete role: ${role.name}`}
                              className="mr-action-btn mr-action-btn--delete"
                              onClick={() => handleOpenDeleteModal(role)}
                              disabled={
                                isLoading || role.name.toLowerCase() === "admin"
                              }
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="mr-no-data-cell">
                          {!error &&
                            !isLoading &&
                            "No roles found. Add a new role to get started."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {roles.length > itemsPerPage && totalPages > 1 && (
                <div className="mr-pagination">
                  <span className="mr-page-info">
                    Page {currentPage} of {totalPages} (Total Roles:{" "}
                    {roles.length})
                  </span>
                  <div className="mr-page-controls">
                    <button
                      className="mr-page-btn mr-page-btn--prev"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1 || isLoading}
                      aria-label="Previous Page"
                    >
                      <FaChevronLeft />
                    </button>
                    {[...Array(totalPages).keys()].map((num) => (
                      <button
                        key={num + 1}
                        aria-current={
                          currentPage === num + 1 ? "page" : undefined
                        }
                        className={`mr-page-btn mr-page-btn--number ${
                          currentPage === num + 1 ? "mr-page-btn--active" : ""
                        }`}
                        onClick={() => setCurrentPage(num + 1)}
                        disabled={isLoading}
                      >
                        {num + 1}
                      </button>
                    ))}
                    <button
                      className="mr-page-btn mr-page-btn--next"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || isLoading}
                      aria-label="Next Page"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              )}

              <div className="mr-back-button-container">
                <Link to="/adminDashboard" className="mr-back-btn">
                  <FaArrowLeft /> Go back to dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <AddRoleModal
          onAdd={handleAddRole}
          onClose={handleCloseAllModals}
          isLoading={isLoading}
        />
      )}
      {isEditModalOpen && roleToEdit && (
        <EditRoleModal
          role={roleToEdit}
          onEdit={handleEditRole}
          onClose={handleCloseAllModals}
          isLoading={isLoading}
        />
      )}
      {isDeleteModalOpen && roleToDelete && (
        <DeleteRoleModal
          role={roleToDelete}
          onDelete={handleDeleteRole}
          onClose={handleCloseAllModals}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default ManageRoles;
