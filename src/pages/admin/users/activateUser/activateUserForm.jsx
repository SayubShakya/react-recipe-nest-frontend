import React from "react";
import "./activateUserForm.css";
import { FaSpinner } from "react-icons/fa";

function ActivateUserForm({ user, onActivate, onClose, isLoading }) {
  if (!user) return null;

  const handleConfirmActivation = async () => {
    try {
      await onActivate(user.id);
      onClose();
    } catch (error) {
      console.error("Activation failed:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={!isLoading ? onClose : undefined}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Activate User</h2>
        <p>
          Are you sure you want to activate the user:{" "}
          <strong>
            {`${user.first_name || ""} ${user.last_name || ""}`.trim() || "N/A"}
          </strong>{" "}
          (<em>{user.email || "N/A"}</em>)?
        </p>
        <p className="info-text">
          Activated users will gain access to the system.
        </p>
        <div className="modal-actions">
          <button
            onClick={handleConfirmActivation}
            className="modal-button activate"
            disabled={isLoading}
          >
            {isLoading ? <FaSpinner className="spinner" /> : "Activate"}
          </button>
          <button
            onClick={onClose}
            className="modal-button cancel"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivateUserForm;
