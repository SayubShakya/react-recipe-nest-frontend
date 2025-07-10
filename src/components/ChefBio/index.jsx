import React from "react";
import { useParams } from "react-router-dom";
import data from "../../data/data";

const ChefBio = () => {
  const { id } = useParams();
  const chef = data.users.find(
    (user) => user.id === id && user.role === "chef"
  );

  if (!chef) {
    return <h2>Chef not found</h2>;
  }

  return (
    <div className="chef-bio">
      <h1>{chef.name}</h1>
      <img src={chef.profileImage} alt={chef.name} />
      <p>{chef.profileSummary}</p>
      <p>
        <strong>Phone:</strong> {chef.phone_number}
      </p>
      <p>
        <strong>Email:</strong> {chef.email}
      </p>
      <p>
        <strong>Address:</strong> {chef.address}
      </p>
      <p>
        <strong>Preferences:</strong> {chef.preferences.join(", ")}
      </p>
    </div>
  );
};

export default ChefBio;
