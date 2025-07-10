import React, { useState } from "react";
import "./resetUserPasswordForm.css";

function ResetUserPasswordForm({ user, onClose, onConfirmReset }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  if (!user) return null;

  const handleReset = (e) => {
    e.preventDefault();

    if (!currentPassword) {
      setError("Please enter the current password (for simulation).");
      return;
    }
    console.log(`Simulating check for current password: ${currentPassword}`);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }
    setError("");
    console.log(
      `Resetting password for user ID: ${user.id}, Email: ${user.email} with new password: ${newPassword} (Simulated)`
    );
    alert(
      `Password for ${user.email} would be reset (Simulated). Check console.`
    );
    onConfirmReset(user.id, newPassword);
    onClose();
  };

  return (
    <div className="rup-modal-overlay">
      <div className="rup-modal-content">
        <button
          className="rup-modal-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2>Reset Password</h2>
        <p className="rup-user-info">
          For: <strong>{user.fullName}</strong> ({user.email})
        </p>
        <form onSubmit={handleReset} className="rup-form">
          <div className="rup-form-group">
            <label htmlFor="rup-current-password">
              Current Password{" "}
              <span className="rup-label-info">(Simulation)</span>
            </label>
            <input
              type="password"
              id="rup-current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="rup-input"
              placeholder="Enter user's current password"
            />
          </div>
          <div className="rup-form-group">
            <label htmlFor="rup-new-password">New Password</label>
            <input
              type="password"
              id="rup-new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="rup-input"
              placeholder="Min. 6 characters"
            />
          </div>
          <div className="rup-form-group">
            <label htmlFor="rup-confirm-password">Confirm New Password</label>
            <input
              type="password"
              id="rup-confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="rup-input"
              placeholder="Retype new password"
            />
          </div>
          {error && <p className="rup-error-message">{error}</p>}
          <div className="rup-button-group">
            <button type="submit" className="rup-btn rup-btn-confirm">
              <i className="fas fa-check"></i> Reset Password
            </button>
            <button
              type="button"
              className="rup-btn rup-btn-cancel"
              onClick={onClose}
            >
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetUserPasswordForm;
