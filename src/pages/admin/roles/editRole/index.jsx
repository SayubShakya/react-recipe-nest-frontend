import { useState, useEffect } from "react";
import "../manageRoles.css";
import { FaSpinner } from "react-icons/fa";

const EditRoleModal = ({ role, onEdit, onClose, isLoading }) => {
  const [roleName, setRoleName] = useState(role ? role.name : "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (role) setRoleName(role.name);
  }, [role]);

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
      await onEdit(role.id, roleName.trim());
    } catch (err) {
      setError(err.message);
    }
  };

  if (!role) return null;

  return (
    <div className="mr-modal-backdrop">
      <div className="mr-modal-content">
        <h2>Edit Role: {role.name}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mr-form-group">
            <label htmlFor="editRoleName">New Role Name:</label>
            <input
              id="editRoleName"
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
              {isLoading ? (
                <FaSpinner className="mr-spinner" />
              ) : (
                "Save Changes"
              )}
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

export default EditRoleModal;
