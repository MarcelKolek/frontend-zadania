import React from "react";

const types = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting", 
  "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", 
  "dragon", "dark", "steel", "fairy"
];

const Filters = ({ selectedType, onTypeChange }) => {
  return (
    <div id="filters" style={{ marginBottom: "20px", textAlign: "center" }}>
      <label htmlFor="type-filter">Filter by Type: </label>
      <select
        id="type-filter"
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
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
