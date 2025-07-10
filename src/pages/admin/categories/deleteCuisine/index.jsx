import React from "react";
import "../manageCuisine.css";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const DeleteCuisineModal = ({ cuisine, onDelete, onClose, isLoading }) => {
  const handleDelete = async () => {
    if (!cuisine?.id) {
      toast.error("Cannot delete: Cuisine ID is missing.");
      return;
    }
    try {
      await onDelete(cuisine.id);
    } catch (err) {
      console.error("Error during deletion process:", err);
    }
  };

  if (!cuisine) return null;

  return (
    <div className="mc-modal-backdrop" onClick={onClose}>
      <div className="mc-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Confirm Deletion</h2>
        <p>
          Are you sure you want to delete the cuisine "
          <strong>{cuisine.name || "this cuisine"}</strong>"?
        </p>
        <p className="mc-warning-text">This action cannot be undone.</p>
        <div className="mc-modal-actions">
          <button
            onClick={handleDelete}
            className="mc-btn mc-btn-danger"
            disabled={isLoading}
            aria-label={`Confirm delete cuisine ${cuisine.name}`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="mc-spinner mc-spinner-btn" /> Deleting...
              </>
            ) : (
              "Delete Cuisine"
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mc-btn mc-btn-cancel"
            disabled={isLoading}
            aria-label="Cancel deletion"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCuisineModal;
