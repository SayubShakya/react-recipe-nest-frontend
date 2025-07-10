import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./manageUsers.css";

import ActivateUserForm from "./activateUser/activateUserForm.jsx";
import DeactivateUserForm from "./deactivateUser/deactivateUserForm.jsx";
import ResetUserPasswordForm from "./resetPassword/resetUserPasswordForm.jsx";
import Sidebar from "../sidebar/index.jsx";
import useApi from "../../../api/index.jsx";
import { stringInReadabaleFormat } from "../../../helpers/index.js";
import { toast } from "react-toastify";

function ManageUsers() {
  const { fetchData, postData, putData, deleteData } = useApi();

  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [userToActivate, setUserToActivate] = useState(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("users api called");

      const response = await fetchData("users");

      if (response?.ok) {
        const result = await response.json();
        setUsers(result?.data?.items || []);
      } else {
        const errorBody = await response.text();
        console.error(`HTTP Error ${response.status}: ${errorBody}`);
        setError(`Failed to fetch users: ${response.statusText}`);
        toast.error(`Failed to fetch users: ${response.statusText}`);
        setUsers([]);
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("An error occurred while fetching users.");
      toast.error("An error occurred while fetching users.");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenActivateModal = (user) => {
    if (user.role === "Admin") {
      toast.info(
        "The primary admin user cannot be activated through this interface."
      );
      return;
    }
    if (user.is_active) {
      toast.info("User is already active.");
      return;
    }
    setUserToActivate(user);
    setIsActivateModalOpen(true);
  };

  const handleActivateConfirm = async (userId) => {
    try {
      setIsLoading(true);
      const response = await postData(`users/status-toggle`, {
        id: userId,
        is_active: true,
      });

      if (!response.ok) {
        const errorBody = await response.json();
        const errorMessage =
          errorBody?.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      handleCloseAllModals();
      toast.success("User activated successfully");
      fetchUsers();
    } catch (err) {
      console.error("Activate user error:", err);
      toast.error(`Failed to activate user: ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDeactivateModal = (user) => {
    if (user.role === "Admin") {
      toast.info(
        "The primary admin user cannot be deactivated through this interface."
      );
      return;
    }
    if (!user.is_active) {
      toast.info("User is already inactive.");
      return;
    }
    setUserToDeactivate(user);
    setIsDeactivateModalOpen(true);
  };

  const handleDeactivateConfirm = async (userId) => {
    try {
      setIsLoading(true);
      const response = await postData(`users/status-toggle`, {
        id: userId,
        is_active: false,
      });

      if (!response.ok) {
        const errorBody = await response.json();
        const errorMessage =
          errorBody?.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      handleCloseAllModals();
      toast.success("User deactivated successfully");
      fetchUsers();
    } catch (err) {
      console.error("Deactivate user error:", err);
      toast.error(`Failed to deactivate user: ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenResetPasswordModal = (user) => {
    setUserToResetPassword(user);
    setIsResetPasswordModalOpen(true);
  };

  const handleConfirmPasswordReset = async (userId, newPassword) => {
    setIsLoading(true);
    try {
      const response = await putData("users/reset-password", {
        id: userId,
        newPassword: newPassword,
      });

      if (!response.ok) {
        const errorBody = await response.json();
        const errorMessage =
          errorBody?.message || `HTTP error! Status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      toast.success(result?.message || "Password reset successfully!");
      handleCloseAllModals();
    } catch (err) {
      console.error("Password reset error:", err);
      toast.error(`Password reset failed: ${err.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAllModals = () => {
    setIsActivateModalOpen(false);
    setUserToActivate(null);
    setIsDeactivateModalOpen(false);
    setUserToDeactivate(null);
    setIsResetPasswordModalOpen(false);
    setUserToResetPassword(null);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="admin-dashboard-container">
        <Sidebar />

        <div className="admin-main-content">
          <div className="mu-container">
            <h1 className="mu-title">Manage Users</h1>

            <div className="mu-table-container">
              <div className="mu-table-header">
                <div className="mu-search-filter"></div>

                <Link to="/register" className="mu-add-user-btn">
                  <i className="fas fa-plus"></i> Add User
                </Link>
              </div>

              {isLoading && users.length === 0 ? (
                <p>Loading users...</p>
              ) : error ? (
                <p className="error-message">{error}</p>
              ) : (
                <>
                  <div className="mu-table-wrapper">
                    <table className="mu-table">
                      <thead>
                        <tr>
                          <th>Full name</th>
                          <th>Email</th>
                          <th>Phone Number</th>
                          <th>Role</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentUsers.map((user) => (
                          <tr key={user.id}>
                            <td data-label="Full name">
                              {`${user.first_name} ${user.last_name}`}{" "}
                            </td>
                            <td data-label="Email">{user.email}</td>
                            <td data-label="Phone Number">
                              {user.phone_number}
                            </td>
                            <td data-label="Role">
                              {stringInReadabaleFormat(user.role)}
                            </td>
                            <td
                              data-label="Action"
                              className="mu-action-buttons"
                            >
                              {!user?.is_active ? (
                                <button
                                  className="mu-action-btn mu-action-btn--activate"
                                  onClick={() => handleOpenActivateModal(user)}
                                  disabled={user.role === "Admin" || isLoading}
                                >
                                  Activate
                                </button>
                              ) : (
                                <button
                                  className="mu-action-btn mu-action-btn--deactivate"
                                  onClick={() =>
                                    handleOpenDeactivateModal(user)
                                  }
                                  disabled={user.role === "Admin" || isLoading}
                                >
                                  Deactivate
                                </button>
                              )}

                              {/* <button
                                className="mu-action-btn mu-action-btn--reset-pw"
                                onClick={() =>
                                  handleOpenResetPasswordModal(user)
                                }
                                disabled={isLoading}
                              >
                                Reset Password
                              </button> */}
                            </td>
                          </tr>
                        ))}
                        {currentUsers.length === 0 && !isLoading && !error && (
                          <tr>
                            <td colSpan="6" className="mu-no-users">
                              No users found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {users.length > 0 && (
                    <div className="mu-pagination">
                      <span className="mu-page-info">
                        Page {currentPage} of {totalPages}
                      </span>
                      <div className="mu-page-controls">
                        <button
                          className="mu-page-btn mu-page-btn--prev"
                          onClick={handlePreviousPage}
                          disabled={currentPage === 1}
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .map((page) => (
                            <button
                              key={page}
                              className={`mu-page-btn mu-page-btn--number ${
                                currentPage === page
                                  ? "mu-page-btn--active"
                                  : ""
                              }`}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          ))
                          .slice(
                            Math.max(0, currentPage - 2),
                            Math.min(totalPages, currentPage + 1)
                          )}

                        <button
                          className="mu-page-btn mu-page-btn--next"
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="mu-back-button-container">
                <Link to="/adminDashboard" className="mu-back-btn">
                  <i className="fas fa-arrow-left"></i> Go back to dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isActivateModalOpen && userToActivate && (
        <ActivateUserForm
          user={userToActivate}
          onActivate={handleActivateConfirm}
          onClose={handleCloseAllModals}
          isLoading={isLoading}
        />
      )}

      {isDeactivateModalOpen && userToDeactivate && (
        <DeactivateUserForm
          user={userToDeactivate}
          onDeactivate={handleDeactivateConfirm}
          onClose={handleCloseAllModals}
          isLoading={isLoading}
        />
      )}

      {isResetPasswordModalOpen && userToResetPassword && (
        <ResetUserPasswordForm
          user={userToResetPassword}
          onClose={handleCloseAllModals}
          onConfirmReset={handleConfirmPasswordReset}
          isLoading={isLoading}
        />
      )}
    </>
  );
}

export default ManageUsers;
