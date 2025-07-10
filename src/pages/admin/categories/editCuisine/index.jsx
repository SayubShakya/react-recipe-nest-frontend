import React, { useState, useEffect } from "react";
import "../manageCuisine.css";
import { FaSpinner } from "react-icons/fa";

const EditCuisineModal = ({ cuisine, onEdit, onClose, isLoading }) => {
  const [cuisineName, setCuisineName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (cuisine) {
      setCuisineName(cuisine.name || "");
      setImageUrl(cuisine.image_url || "");
    }
  }, [cuisine]);

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

    const originalImageUrl = cuisine.image_url || "";
    if (trimmedName === cuisine.name && trimmedUrl === originalImageUrl) {
      setError("No changes detected.");
      return;
    }

    try {
      await onEdit({
        id: cuisine.id,
        name: trimmedName,
        image_url: trimmedUrl || null,
      });
    } catch (err) {
      console.error("Error during edit process:", err);
      setError(err.message || "Failed to initiate update. Please try again.");
    }
  };

  if (!cuisine) return null;

  return (
    <div className="mc-modal-backdrop" onClick={onClose}>
      <div className="mc-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Cuisine: {cuisine.name || "Cuisine"}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mc-form-group">
            <label htmlFor="editCuisineName">Cuisine Name:</label>
            <input
              id="editCuisineName"
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
                error.includes("name") ? "edit-name-error" : undefined
              }
            />
            {error.includes("name") && (
              <p id="edit-name-error" className="mc-error-text">
                {error}
              </p>
            )}
          </div>

          <div className="mc-form-group">
            {" "}
            <label htmlFor="editImageUrl">Image URL (Optional):</label>
            <input
              id="editImageUrl"
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
                error.includes("URL") ? "edit-url-error" : undefined
              }
            />
            {error.includes("URL") && (
              <p id="edit-url-error" className="mc-error-text">
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
              aria-label="Save changes to cuisine"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="mc-spinner mc-spinner-btn" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mc-btn mc-btn-cancel"
              disabled={isLoading}
              aria-label="Cancel editing"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCuisineModal;
