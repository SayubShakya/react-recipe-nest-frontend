import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./viewChefs.css";
import Sidebar from "../sidebar";
import useApi from "../../../api";

function ViewChefs() {
  const { fetchData } = useApi();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const [chefs, setchefs] = useState([]);
  const fetchChefs = async () => {
    try {
      setIsLoading(true);

      const response = await fetchData("users/chefs");

      if (response?.ok) {
        const result = await response.json();
        setchefs(result?.data?.items);
      } else {
        setError(response?.status);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChefs();
  }, []);

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate("/foodLoverDashboard", { replace: true });
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <div className="header">
          <h2>Chefs List</h2>
        </div>

        {isLoading ? (
          <div className="loading-indicator">Loading chefs...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="chef-table-wrapper">
            <table className="chef-data-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {chefs.length > 0 ? (
                  chefs.map((chef, idx) => (
                    <tr key={`chef-${chef.email}-${idx}`}>
                      <td>{`${chef.first_name} ${chef.last_name}` || "N/A"}</td>
                      <td>{chef.email || "N/A"}</td>
                      <td>{chef.phone_number || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data-message">
                      No chefs found matching the selected criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="back-button-container">
          <button
            className="back-button"
            onClick={handleBack}
            aria-label="Go back to dashboard"
          >
            <span className="back-button-icon">←</span> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewChefs;
