"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PokemonList = ({ pokemonList }) => {
  const [favorites, setFavorites] = useState(
    JSON.parse(typeof window !== "undefined" ? localStorage.getItem("favorites") : "[]") || []
  );

  const [compareList, setCompareList] = useState(
    JSON.parse(typeof window !== "undefined" ? localStorage.getItem("compareList") : "[]") || []
  );

  const router = useRouter();

  const isFavorite = (id) => favorites.some((pokemon) => pokemon.id === id);

  const handleToggleFavorite = (pokemon) => {
    let updatedFavorites;
    if (isFavorite(pokemon.id)) {
      updatedFavorites = favorites.filter((fav) => fav.id !== pokemon.id);
    } else {
      updatedFavorites = [...favorites, pokemon];
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  const isCompare = (id) => compareList.some((pokemon) => pokemon.id === id);

  const handleToggleCompare = (pokemon) => {
    let updatedCompareList = [...compareList];

    if (isCompare(pokemon.id)) {
      updatedCompareList = compareList.filter((compare) => compare.id !== pokemon.id);
    } else if (compareList.length < 2) {
      updatedCompareList.push(pokemon);
    }

    localStorage.setItem("compareList", JSON.stringify(updatedCompareList));
    setCompareList(updatedCompareList);

    if (updatedCompareList.length === 2) {
      router.push("/compare");
    }
  };

  const sortedPokemonList = [
    ...compareList,
    ...pokemonList.filter((pokemon) => !compareList.some((compare) => compare.id === pokemon.id)),
  ];

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const savedCompareList = JSON.parse(localStorage.getItem("compareList") || "[]");
  
    setFavorites(savedFavorites);
    setCompareList(savedCompareList);
  }, []);
  

  return (
    <ul id="pokemon-ul">
      {sortedPokemonList.length > 0 ? (
        sortedPokemonList.map((pokemon) => {
          if (!pokemon.id || !pokemon.name) {
            console.error("Missing id or name for Pokémon:", pokemon);
            return null;
          }

          return (
            <li
              key={pokemon.name}
              className={`pokemon ${isCompare(pokemon.id) ? "selected" : ""}`}
            >
              <Link href={`/pokemon/${pokemon.id}`}>
                <h3>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                  alt={pokemon.name}
                />
              </Link>
              <button
                id="favorite"
                className={isFavorite(pokemon.id) ? "remove" : "add"}
                onClick={() =>
                  handleToggleFavorite({
                    id: pokemon.id,
                    name: pokemon.name,
                    sprites: {
                      front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
                    },
                    types: pokemon.types,
                  })
                }
              >
                {isFavorite(pokemon.id) ? "Remove from Favorites" : "Add to Favorites"}
              </button>
              <button
                id="compare"
                className={
                  isCompare(pokemon.id)
                    ? "compare-btn remove"
                    : compareList.length === 2
                    ? "compare-btn disabled"
                    : "compare-btn add"
                }
                disabled={compareList.length === 2 && !isCompare(pokemon.id)}
                onClick={() =>
                  handleToggleCompare({
                    id: pokemon.id,
                    name: pokemon.name,
                    sprites: {
                      front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
                    },
                    types: pokemon.types,
                  })
                }
              >
                {isCompare(pokemon.id) ? "Remove from Compare" : "Add to Compare"}
              </button>
            </li>
          );
        })
      ) : (
        <li className="no-results">No Pokémon found.</li>
      )}
    </ul>
  );
};

export default PokemonList;
