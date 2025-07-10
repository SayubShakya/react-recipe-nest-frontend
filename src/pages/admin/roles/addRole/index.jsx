import { useState } from "react";
import "../manageRoles.css";
import { FaSpinner } from "react-icons/fa";

const AddRoleModal = ({ onAdd, onClose, isLoading }) => {
  const [roleName, setRoleName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!roleName.trim()) {
      setError("Role name cannot be empty");
      return;
    }

    if (roleName.trim().length > 50) {
      setError("Role name cannot exceed 50 characters");
      return;
    }

    try {
      await onAdd(roleName.trim());
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mr-modal-backdrop">
      <div className="mr-modal-content">
        <h2>Add New Role</h2>
        <form onSubmit={handleSubmit}>
          <div className="mr-form-group">
            <label htmlFor="roleName">Role Name:</label>
            <input
              id="roleName"
              className="mr-form-control"
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
              maxLength={50}
              autoFocus
              disabled={isLoading}
            />
            {error && <p className="mr-error-text">{error}</p>}
          </div>
          <div className="mr-modal-actions">
            <button
              type="submit"
              className="mr-btn mr-btn-confirm"
              disabled={isLoading}
            >
              {isLoading ? <FaSpinner className="mr-spinner" /> : "Add Role"}
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
        </form>
      </div>
    </div>
  );
};

export default AddRoleModal;
