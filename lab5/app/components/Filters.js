"use client";

import React, { useEffect, useState } from "react";

const types = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting",
  "poison", "ground", "flying", "psychic", "bug", "rock", "ghost",
  "dragon", "dark", "steel", "fairy"
];

const Filters = ({ selectedType, onTypeChange }) => {
  const [typeFilter, setTypeFilter] = useState(() => {
    return localStorage.getItem("selectedType") || selectedType || "";
  });

  const handleChange = (newType) => {
    setTypeFilter(newType);
    localStorage.setItem("selectedType", newType);
    onTypeChange(newType);
  };

  useEffect(() => {
    setTypeFilter(selectedType);
  }, [selectedType]);

  return (
    <div id="filters" style={{ marginBottom: "20px", textAlign: "center" }}>
      <label htmlFor="type-filter">Filter by Type: </label>
      <select
        id="type-filter"
        value={typeFilter}
        onChange={(e) => handleChange(e.target.value)}
      >
        <option value="">All Types</option>
        {types.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filters;
