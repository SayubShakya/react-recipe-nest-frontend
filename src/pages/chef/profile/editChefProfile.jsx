import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../sidebar";
import { toast } from "react-toastify";
import useApi from "../../../api";

const ChefEditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { fetchData, putData } = useApi();
  const loggedInData = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    image_url:
      "https://gravatar.com/avatar/3ddc49ac922e89726a2ceb70b3d45564?s=400&d=robohash&r=x",
    about: "",
  });

  useEffect(() => {
    if (!loggedInData?.id) {
      toast.error("User not logged in or ID missing.");
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchData(`users?id=${loggedInData.id}`);
        if (response?.ok) {
          const result = await response.json();
          if (result?.data) {
            setUserData(result.data);
          } else {
            setError("User data not found in response.");
            toast.error("Could not load profile data.");
          }
        } else {
          setError(`Failed to fetch profile. Status: ${response?.status}`);
          toast.error(`Failed to fetch profile. Status: ${response?.status}`);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(`An error occurred: ${err.message}`);
        toast.error("An error occurred while fetching the profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [loggedInData?.id, navigate]);

  useEffect(() => {
    if (userData) {
      setFormData({
        id: userData.id || "",
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        phone_number: userData.phone_number || "",
        about: userData.about || "",
        image_url:
          userData.image_url ||
          "https://gravatar.com/avatar/3ddc49ac922e89726a2ceb70b3d45564?s=400&d=robohash&r=x",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const updatePayload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number,
      about: formData.about,
      image_url: formData.image_url,
    };

    try {
      console.log("Sending update payload:", updatePayload);
      const response = await putData("users/profile", updatePayload);

      if (!response.ok) {
        let errorMsg = `HTTP error! Status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData?.message || errorData?.error || errorMsg;
        } catch (jsonError) {}
        throw new Error(errorMsg);
      }

      const result = await response.json();
      toast.success(`Profile updated successfully`);
      setUserData(result.data);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(`Update failed: ${err.message}`);
      toast.error(`Error updating profile: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !userData) {
    return (
      <div className="editprofile-container">
        <Sidebar />
        <div className="editprofile-main editprofile-loading">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="editprofile-container">
        <Sidebar />
        <div className="editprofile-main editprofile-error">
          <p>Error loading profile: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="editprofile-back-btn"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="editprofile-container">
      <Sidebar />
      <div className="editprofile-main">
        <div className="editprofile-banner"></div>

        <div className="editprofile-header">
          {/* {userData && (
            <h2 className="editprofile-username">
              {userData.first_name} {userData.last_name}
            </h2>
          )} */}
        </div>

        <div className="editprofile-form-wrapper">
          {formData.image_url && (
            <div className="editprofile-image-preview">
              <img
                src={formData.image_url}
                alt="Preview"
                className="editprofile-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://gravatar.com/avatar/3ddc49ac922e89726a2ceb70b3d45564?s=400&d=robohash&r=x";
                }}
              />
            </div>
          )}

          <form
            className="editprofile-form"
            onSubmit={handleProfileUpdateSubmit}
          >
            {error && <p className="editprofile-error-message">{error}</p>}

            <div className="editprofile-form-group">
              <label htmlFor="first_name" className="editprofile-label">
                First name:
              </label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="editprofile-input"
                required
                disabled={isLoading}
              />
            </div>

            <div className="editprofile-form-group">
              <label htmlFor="last_name" className="editprofile-label">
                Last name:
              </label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="editprofile-input"
                required
                disabled={isLoading}
              />
            </div>
            <div className="editprofile-form-group">
              <label htmlFor="phone" className="editprofile-label">
                Phone Number:
              </label>
              <input
                id="phone"
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="+X-XXX-XXX-XXXX"
                className="editprofile-input"
                disabled={isLoading}
              />
            </div>

            <div className="editprofile-form-group">
              <label htmlFor="last_name" className="editprofile-label">
                About:
              </label>
              <input
                id="last_name"
                type="text"
                name="about"
                value={formData.about}
                onChange={handleChange}
                className="editprofile-input"
                required
                disabled={isLoading}
              />
            </div>
            <div className="editprofile-form-group">
              <label htmlFor="last_name" className="editprofile-label">
                Image URL:
              </label>
              <input
                id="last_name"
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="editprofile-input"
                disabled={isLoading}
              />
            </div>
            <div className="editprofile-button-group">
              <button
                type="submit"
                className="editprofile-update-btn"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="editprofile-back-btn"
                disabled={isLoading}
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChefEditProfile;
