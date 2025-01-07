"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Filters from "../components/Filters";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [selectedType, setSelectedType] = useState(
    localStorage.getItem("selectedType") || ""
  );
  const router = useRouter();

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);

    const initialFiltered = selectedType
      ? savedFavorites.filter((pokemon) => pokemon.types.includes(selectedType))
      : savedFavorites;

    setFilteredFavorites(initialFiltered);
  }, [selectedType]);

  const handleRemoveFavorite = (id) => {
    const updatedFavorites = favorites.filter((pokemon) => pokemon.id !== id);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);

    const updatedFiltered = selectedType
      ? updatedFavorites.filter((pokemon) => pokemon.types.includes(selectedType))
      : updatedFavorites;

    setFilteredFavorites(updatedFiltered);
  };

  const handlePokemonClick = (id) => {
    router.push(`/pokemon/${id}`);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    localStorage.setItem("selectedType", type);

    const filtered = type
      ? favorites.filter((pokemon) => pokemon.types.includes(type))
      : favorites;

    setFilteredFavorites(filtered);
  };

  return (
    <main>
      <h2>Your Favorite Pokémon</h2>
      <Filters selectedType={selectedType} onTypeChange={handleTypeChange} />
      {filteredFavorites.length === 0 ? (
        <p>You have no favorite Pokémon yet.</p>
      ) : (
        <div id="pokemon-list">
          <ul>
            {filteredFavorites.map((pokemon) => (
              <li key={pokemon.id} className="pokemon">
                <h3 onClick={() => handlePokemonClick(pokemon.id)}>
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </h3>
                <img
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  onClick={() => handlePokemonClick(pokemon.id)}
                  style={{ cursor: "pointer" }}
                />
                <button
                  id="favorite"
                  className="remove"
                  onClick={() => handleRemoveFavorite(pokemon.id)}
                >
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
