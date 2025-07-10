import React from "react";
import "./deactivateUserForm.css";
import { FaSpinner } from "react-icons/fa";

function DeactivateUserForm({ user, onDeactivate, onClose, isLoading }) {
  if (!user) return null;

  const handleConfirmDeactivation = () => {
    onDeactivate(user.id);
  };

  return (
    <div className="modal-overlay" onClick={!isLoading ? onClose : undefined}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Deactivate User</h2>
        <p>
          Are you sure you want to deactivate the user:{" "}
          <strong>
            {`${user.first_name || ""} ${user.last_name || ""}`.trim() || "N/A"}
          </strong>{" "}
          (<em>{user.email || "N/A"}</em>)?
        </p>
        <p className="warning-text">Deactivated users may lose access.</p>
        <div className="modal-actions">
          <button
            onClick={handleConfirmDeactivation}
            className="modal-button deactivate"
            disabled={isLoading}
          >
            {isLoading ? <FaSpinner className="spinner" /> : "Deactivate"}
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

export default DeactivateUserForm;
