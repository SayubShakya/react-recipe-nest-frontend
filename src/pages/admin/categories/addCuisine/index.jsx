import React, { useState } from "react";
import "../manageCuisine.css";
import { FaSpinner } from "react-icons/fa";

const AddCuisineModal = ({ onAdd, onClose, isLoading }) => {
  const [cuisineName, setCuisineName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = cuisineName.trim();
    const trimmedUrl = imageUrl.trim();

    if (!trimmedName) {
      setError("Cuisine name cannot be empty");
      return;
    }
    if (trimmedName.length > 100) {
      setError("Cuisine name cannot exceed 100 characters");
      return;
    }
    if (trimmedUrl && !trimmedUrl.startsWith("http")) {
      setError("Please enter a valid URL (starting with http:// or https://)");
      return;
    }
    if (trimmedUrl.length > 255) {
      setError("Image URL cannot exceed 255 characters");
      return;
    }

    try {
      await onAdd(trimmedName, trimmedUrl || null);
    } catch (err) {
      console.error("Error during add process:", err);
      setError(err.message || "Failed to initiate add. Please try again.");
    }
  };

  return (
    <div className="mc-modal-backdrop" onClick={onClose}>
      <div className="mc-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add New Cuisine</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mc-form-group">
            <label htmlFor="addCuisineName">Cuisine Name:</label>
            <input
              id="addCuisineName"
              className={`mc-form-control ${
                error.includes("name") ? "mc-input-error" : ""
              }`}
              type="text"
              value={cuisineName}
              onChange={(e) => setCuisineName(e.target.value)}
              required
              maxLength={100}
              autoFocus
              disabled={isLoading}
              aria-describedby={
                error.includes("name") ? "add-name-error" : undefined
              }
            />
            {error.includes("name") && (
              <p id="add-name-error" className="mc-error-text">
                {error}
              </p>
            )}
          </div>

          <div className="mc-form-group">
            <label htmlFor="addImageUrl">Image URL (Optional):</label>
            <input
              id="addImageUrl"
              className={`mc-form-control ${
                error.includes("URL") ? "mc-input-error" : ""
              }`}
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              maxLength={255}
              disabled={isLoading}
              placeholder="https://example.com/image.jpg"
              aria-describedby={
                error.includes("URL") ? "add-url-error" : undefined
              }
            />
            {error.includes("URL") && (
              <p id="add-url-error" className="mc-error-text">
                {error}
              </p>
            )}
          </div>

          {error && !error.includes("name") && !error.includes("URL") && (
            <p className="mc-error-text">{error}</p>
          )}

          <div className="mc-modal-actions">
            <button
              type="submit"
              className="mc-btn mc-btn-confirm"
              disabled={isLoading}
              aria-label="Add new cuisine"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="mc-spinner mc-spinner-btn" /> Adding...
                </>
              ) : (
                "Add Cuisine"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mc-btn mc-btn-cancel"
              disabled={isLoading}
              aria-label="Cancel adding cuisine"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCuisineModal;
