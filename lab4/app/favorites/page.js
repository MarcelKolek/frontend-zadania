"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Filters from "../components/Filters";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
    setFilteredFavorites(savedFavorites);
  }, []);

  const handleRemoveFavorite = (id) => {
    const updatedFavorites = favorites.filter((pokemon) => pokemon.id !== id);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
    setFilteredFavorites(updatedFavorites);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handlePokemonClick = (id) => {
    router.push(`/pokemon/${id}`);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);

    const filtered = type
      ? favorites.filter((pokemon) => pokemon.types.includes(type))
      : favorites;

    setFilteredFavorites(filtered);
  };

  return (
    <main>
      <h2>Your Favorite Pokémon</h2>
      <Filters selectedType={selectedType} onTypeChange={handleTypeChange} /> {}
      {filteredFavorites.length === 0 ? (
        <p>You have no favorite Pokémon yet.</p>
      ) : (
        <div id="pokemon-list">
          <ul>
            {filteredFavorites.map((pokemon) => (
              <li key={pokemon.id} className="pokemon">
                <h3 onClick={() => handlePokemonClick(pokemon.id)}>
                  {capitalizeFirstLetter(pokemon.name)}
                </h3>
                <img
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  onClick={() => handlePokemonClick(pokemon.id)}
                  style={{ cursor: "pointer" }}
                />
                <button id="favorite" onClick={() => handleRemoveFavorite(pokemon.id)}>
                  Remove from Favorites
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
