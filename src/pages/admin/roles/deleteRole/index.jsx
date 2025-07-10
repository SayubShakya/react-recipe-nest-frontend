import { useState, useEffect } from "react";
import "../manageRoles.css";
import { FaSpinner } from "react-icons/fa";

const DeleteRoleModal = ({ role, onDelete, onClose, isLoading }) => {
  const handleDelete = async () => {
    try {
      await onDelete(role.id);
    } catch (err) {
      toast.error(`Failed to delete role: ${err.message}`);
    }
  };

  if (!role) return null;

  return (
    <div className="mr-modal-backdrop">
      <div className="mr-modal-content">
        <h2>Confirm Deletion</h2>
        <p>
          Are you sure you want to delete the role "<strong>{role.name}</strong>
          "?
        </p>
        <p className="mr-warning-text">This action cannot be undone.</p>
        <div className="mr-modal-actions">
          <button
            onClick={handleDelete}
            className="mr-btn mr-btn-danger"
            disabled={isLoading}
          >
            {isLoading ? <FaSpinner className="mr-spinner" /> : "Delete Role"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mr-btn mr-btn-cancel"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteRoleModal;
