import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useApi from "../../api/index";

const FoodsList = () => {
  const [foodsList, setFoodsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [filteredFoodData, setFilteredFoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchData } = useApi();

  const filterFoodsByCuisine = (cuisineValue) => {
    const filteredValue = foodsList.filter(
      (food) => food.cuisine === cuisineValue
    );
    setFilteredFoodData(!!cuisineValue ? filteredValue : foodsList);
  };

  const foodDataToMap =
    filteredFoodData.length > 0 ? filteredFoodData : foodsList;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const categoriesResponse = await fetchData("cuisines");
        if (categoriesResponse?.ok) {
          const categoriesResult = await categoriesResponse.json();
          setCategoriesList(categoriesResult?.data?.items || []);
        }

        // Fetch foods
        const foodsResponse = await fetchData("recipes");
        if (foodsResponse?.ok) {
          const foodsResult = await foodsResponse.json();
          setFoodsList(foodsResult?.data?.items || []);
          setFilteredFoodData(foodsResult?.data?.items || []);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading recipes...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div>
      <div className="categories-block">
        <nav>
          <Link onClick={() => filterFoodsByCuisine("")}>{"All"}</Link>
          {categoriesList.map((category) => (
            <Link
              key={category.id}
              onClick={() => filterFoodsByCuisine(category.name)}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="foods-grid">
        {foodDataToMap.map((food) => (
          <Link key={food.id} to={`food/${food.id}`} className="card">
            <img
              src={food.image_url}
              alt={food.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/600x400?text=NO+IMAGE";
              }}
            />
            <h3>{food.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FoodsList;
