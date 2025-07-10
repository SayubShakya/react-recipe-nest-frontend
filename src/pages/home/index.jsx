import React, { useEffect, useState } from "react";
import data from "../../data/data";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

const Home = () => {
  const navigate = useNavigate();

  const [categoriesList, setCategoriesList] = useState([]);
  const [foodsList, setFoodsList] = useState([]);
  const [filteredFoodData, setFilteredFoodData] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [selectedChef, setSelectedChef] = useState(null);

  useEffect(() => {
    setCategoriesList(data.categories);
    setUsersList(data.users);
    setFoodsList(data.foods);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chefsList = usersList.filter((user) => user.role === "chef");

  const filterFoodsByCuisine = (cuisineValue) => {
    const filteredValue = foodsList.filter(
      (food) => food.cuisine === cuisineValue
    );
    setFilteredFoodData(cuisineValue ? filteredValue : foodsList);
  };

  const handleChefClick = (chefName) => {
    const chef = chefsList.find((chef) => chef.name === chefName);
    setSelectedChef(chef);
  };

  const closeModal = () => {
    setSelectedChef(null);
  };

  const handleRedirectToLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <br />
      <br /> <br />
      <br /> <br />
      <div className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">
            Cooking Made Fun and Easy: Unleash Your Inner Chef
          </h1>
          <p className="hero-sub-title">
            Your trusted source for delicious, home-cooked meals.
          </p>
          <img src="/HomePagePhoto.jpg" alt="Signature dish" />
          <br />

          <button className="hero-button" onClick={handleRedirectToLogin}>
            Read more..
          </button>
        </div>
      </div>
      <h1 className="section-title">Our Best & Delicious Recipe</h1>
      <br />
      <div className="categories-block">
        <nav>
          <Link onClick={() => filterFoodsByCuisine("")}>All</Link>
          {categoriesList.map((category) => (
            <Link
              key={category.slug}
              onClick={() => filterFoodsByCuisine(category.title)}
            >
              {category.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="grid">
        {(filteredFoodData.length > 0 ? filteredFoodData : foodsList).map(
          (food) => (
            <Link key={food.id} to={`food/${food.id}`} className="card">
              {" "}
              <img src={food.recipe_photo} alt={food.title} />
              <div className="card-info">{food.title}</div>
              <div className="view-details">View details</div>
            </Link>
          )
        )}
      </div>
      <br />
      <br />
      <br />
      <br />
      <div className="best-chefs-section">
        <h2 className="section-title">Our Best Chefs</h2>

        <div className="chef-profiles">
          <div className="chef-profile">
            <div className="chef-number">1</div>
            <div className="chef-info">
              <h3>Amit Shakya</h3>
              <p>
                A passionate Nepali-trained chef in Asian foods. He's a popular
                culinary instructor who specializes in traditional and modern
                Nepali cuisine. He has been featured in various cooking shows
                and actively promotes Nepali food culture.
              </p>

              <button
                className="learn-more-btn"
                onClick={handleRedirectToLogin}
              >
                Website
              </button>
            </div>
            <div className="chef-media">
              <img className="chef-image" src="/Amit.jpg" alt="Amit Shakya" />
              <div className="dish-images">
                <img src="/nepaliThali.jpg" alt="Newari khaja set" />
              </div>
              <p className="dish-description">
                The image shows a Newari khaja set, a traditional Nepali cuisine
                with chiura, lentils, curries, and spiced meats.
              </p>
            </div>
          </div>

          <div className="chef-profile">
            <div className="chef-number">2</div>
            <div className="chef-info">
              <h3>Martin Yan</h3>
              <p>
                A legendary chef-television star in Asian city. He is a popular
                culinary expert known for his expertise in traditional and
                contemporary Asian cuisine. Martin hosts cooking shows,
                publishes coveted cookbooks, and actively promotes Asian food
                heritage.
              </p>

              <button
                className="learn-more-btn"
                onClick={handleRedirectToLogin}
              >
                Website
              </button>
            </div>
            <div className="chef-media">
              <img className="chef-image" src="/martin.jpg" alt="Martin Yan" />
              <div className="dish-images">
                <img src="/MartinYanDish.jpg" alt="Healthy salad bowl" />
              </div>
              <p className="dish-description">
                The image shows a healthy salad bowl with tofu, veggies, boiled
                eggs, and corn, packed with nutrients.
              </p>
            </div>
          </div>
        </div>

        <div className="view-all-chefs-container">
          <Link to="/login" className="view-all-chefs-button">
            {" "}
            View All Chefs
          </Link>
        </div>
      </div>
      <div className="recipenest-section">
        <div className="recipenest-container">
          <div className="recipenest-content">
            <h2>RecipeNest</h2>
            <p className="recipenest-description">
              "RecipeNest is a community where chefs share their best home-style
              recipes, crafted with love and passion. Discover simple, delicious
              dishes straight from the chefs who create them. Whether you're
              looking for inspiration or a taste of homemade goodness,
              RecipeNest brings the heart of the kitchen to you."{" "}
            </p>
            <div className="recipenest-logo-container">
              <div className="recipenest-logo">
                <img src="/RecipeNestLogo.png" alt="RecipeNest Logo" />
              </div>
              <div className="recipenest-text">
                <p className="recipenest-title">RecipeNest</p>
                <p className="recipenest-subtitle">Team RecipeNest</p>
              </div>
            </div>
          </div>
          <div className="recipenest-image">
            <img src="/HomePageYoumari.png" alt="Food photography" />
          </div>
        </div>
      </div>
      {selectedChef && (
        <div className="modal-overlay">
          {" "}
          <div className="modal-content">
            {" "}
            <h2>{selectedChef.name}</h2>
            <p>{selectedChef.profileSummary}</p>
            <img src={selectedChef.profileImage} alt={selectedChef.name} />
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
      <button className="go-to-top" onClick={scrollToTop}>
        {" "}
        Go to Top ↑
      </button>
    </>
  );
};

export default Home;
