import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaPhone, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";
import { toast } from "react-toastify";
import useApi from "../../../api/index.jsx";
import "./RegisterStyles.css";

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    confirmPassword: "",
    role_id: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const { fetchData, postData } = useApi();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchRoles = async () => {
    try {
      const response = await fetchData("roles");
      if (response?.ok) {
        const result = await response.json();
        setRoles(result?.data?.items || []);
      } else {
        setError(response?.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const {
      first_name,
      last_name,
      phone_number,
      email,
      password,
      confirmPassword,
    } = formData;

    if (
      !first_name ||
      !last_name ||
      !phone_number ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone_number)) {
      setError(
        "Invalid phone number format. Only digits (10-15 characters) are allowed."
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      userData.role_id = +userData.role_id;
      const response = await postData("auth/register", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.status === 201) {
        toast.success("Registration successful!", {
          onClose: () => navigate("/login"),
          autoClose: 2000,
        });
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Registration failed";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage =
        err.response?.data?.message || "An error occurred during registration";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registerMainContainerr">
      <div className="registerCardContainer">
        <div className="registerLeft">
          <img
            src="/LoginBackgroung2.jpg"
            alt="Colorful spices"
            className="registerSpices"
          />
        </div>

        <div className="registerFormSection">
          <div className="registerHeaderSection">
            <div className="registerLogoContainer">
              <img
                src="/RecipeNestLogo.png"
                alt="Logo"
                className="registerLogoImage"
              />
            </div>
            <h2>Create your Account</h2>
          </div>

          {error && (
            <div className="registerErrorMessage" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="registerFormGroup">
              <label htmlFor="first_name">
                <FaUser className="registerInputIcon" />
                First name:
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
                autoComplete="given-name"
              />
            </div>

            <div className="registerFormGroup">
              <label htmlFor="last_name">
                <FaUser className="registerInputIcon" />
                Last name:
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
                autoComplete="family-name"
              />
            </div>

            <div className="registerFormGroup">
              <label htmlFor="phone_number">
                <FaPhone className="registerInputIcon" />
                Phone Number:
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                autoComplete="tel"
              />
            </div>

            <div className="registerFormGroup">
              <label htmlFor="email">
                <FaEnvelope className="registerInputIcon" />
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@gmail.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="registerFormGroup">
              <label htmlFor="password">
                <FaLock className="registerInputIcon" />
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="registerFormGroup">
              <label htmlFor="confirmPassword">
                <FaLock className="registerInputIcon" />
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>

            <label htmlFor="role_id" className="chef-section-title">
              Role
            </label>
            <select
              id="role_id"
              name="role_id"
              className={`chef-form-select`}
              value={formData.role_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="registerSubmitButton"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="registerLoginLink">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
