import { useState } from "react";

const PokemonDetails = ({ details }) => {
  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return favorites.some((pokemon) => pokemon.id === details.id);
  });

  const handleToggleFavorite = () => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (isFavorite) {
      favorites = favorites.filter((pokemon) => pokemon.id !== details.id);
    } else {
      const newFavorite = {
        id: details.id,
        name: details.name,
        sprites: details.sprites,
        types: details.types.map((type) => type.type.name),
      };
      favorites.push(newFavorite);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <div>
      <h3>{details.name}</h3>
      <img src={details.sprites.front_default} alt={details.name} />
      <p>
        <strong>Height:</strong> {details.height / 10} m
      </p>
      <p>
        <strong>Weight:</strong> {details.weight / 10} kg
      </p>
      <p>
        <strong>Types:</strong> {details.types.map((type) => type.type.name).join(", ")}
      </p>
      <h4>Stats:</h4>
      <ul>
        {details.stats.map((stat) => (
          <li key={stat.stat.name}>
            <strong>{stat.stat.name}:</strong> {stat.base_stat}
          </li>
        ))}
      </ul>
      <button id="favorite" onClick={handleToggleFavorite}>
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
    </div>
  );
};

export default PokemonDetails;
