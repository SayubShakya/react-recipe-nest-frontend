import React, { useEffect, useState } from "react";
import "./login-style.css";
import data from "../../../data/data";
import { FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useApi from "../../../api";

const Login = () => {
  const { fetchData } = useApi();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(""); // Clear previous errors

    const raw = { email, password };

    const requestOptions = {
      method: "POST",
      body: JSON.stringify(raw),
    };

    fetch("http://localhost:9000/api/rest/auth/login", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.statusCode === 200) {
          toast.success(result.message);
          sessionStorage.setItem("token", result.data);
          setIsLoggedIn(true);
        } else {
          toast.error(result.message);
        }
      })
      .catch((error) => console.error(error));

    const user = data.users.find(
      (user) => user.email === email && user.password === password
    );
  };

  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        const response = await fetchData("auth/authorized");

        if (response?.ok) {
          const result = await response.json();
          sessionStorage.setItem("user", JSON.stringify(result.data));
          if (result?.data?.role === "ADMIN") {
            navigate("/adminDashboard");
          }
          if (result?.data?.role === "CHEF") {
            navigate("/chefDashboard");
          }
          if (result?.data?.role === "FOOD_LOVER") {
            navigate("/foodLoverDashboard");
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    !!isLoggedIn && getLoggedInUser();
  }, [isLoggedIn]);

  return (
    <div className="userLogin-container">
      <div className="userLogin-card">
        <div className="userLogin-left">
          <img
            src="/LoginBackgroung2.jpg"
            alt="Colorful spices"
            className="userLogin-image"
          />
        </div>

        <div className="userLogin-right">
          <div className="userLogin-header">
            <div className="userLogin-logo">
              <img
                src="/RecipeNestLogo.png"
                alt="Logo"
                className="userLogin-logoImage"
              />
            </div>
            <h2>Login to your Account</h2>
          </div>

          {error && <div className="userLogin-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="userLogin-formGroup">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@gmail.com"
              />
            </div>

            <div className="userLogin-formGroup">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="userLogin-remember">
              <div className="userLogin-checkbox">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember Me</label>
              </div>

              <a href="#" className="userLogin-forgot">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="userLogin-button">
              Login
            </button>
          </form>

          <div className="userLogin-footer">
            <p>
              Not Registered Yet?
              <a href="/register" className="userLogin-create">
                Create an account
              </a>
            </p>

            <div className="userLogin-social">
              <a href="#" className="userLogin-socialIcon">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="userLogin-socialIcon">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="userLogin-socialIcon">
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
