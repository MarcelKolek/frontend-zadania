"use client";

import { useEffect, useState } from "react";

export default function ComparisonPage() {
  const [compareList, setCompareList] = useState([]);
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("favorites")) || [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCompareList = JSON.parse(localStorage.getItem("compareList")) || [];
      const compareIds = storedCompareList.map((pokemon) => pokemon.id);
      setCompareList(compareIds);
    }
  }, []);

  useEffect(() => {
    const fetchPokemonData = async () => {
      if (!compareList || compareList.length !== 2) {
        console.error("Exactly 2 Pokémon IDs should be in the compareList");
        setLoading(false);
        return;
      }

      try {
        const promises = compareList.map((id) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to fetch data for Pokémon ID ${id}`);
            }
            return res.json();
          })
        );

        const results = await Promise.all(promises);
        results.forEach((pokemon) => {
          pokemon.name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        });
        setPokemonData(results);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (compareList.length === 2) {
      fetchPokemonData();
    }
  }, [compareList]);

  const calculateStatDifferences = (statName) => {
    const statA = pokemonData[0].stats.find((stat) => stat.stat.name === statName)?.base_stat || 0;
    const statB = pokemonData[1].stats.find((stat) => stat.stat.name === statName)?.base_stat || 0;

    return {
      statA,
      statB,
      diffA: statA - statB,
      diffB: statB - statA,
    };
  };

  const toggleFavorite = (pokemon) => {
    const isFavorite = favorites.some((fav) => fav.id === pokemon.id);
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter((fav) => fav.id !== pokemon.id);
    } else {
      const newFavorite = {
        id: pokemon.id,
        name: pokemon.name,
        sprites: pokemon.sprites,
        types: pokemon.types.map((type) => type.type.name),
      };
      updatedFavorites = [...favorites, newFavorite];
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  if (loading) return <p>Loading...</p>;

  if (pokemonData.length !== 2) {
    return <p>Unable to load Pokémon comparison. Ensure there are exactly 2 Pokémon IDs in the compare list.</p>;
  }

  return (
    <div id="compare-view">
      {[0, 1].map((index) => {
        const isFavorite = favorites.some((fav) => fav.id === pokemonData[index].id);

        return (
          <div className="pokemon-detail" key={index}>
            <h3>{pokemonData[index].name}</h3>
            <img
              src={pokemonData[index].sprites.front_default}
              alt={`${pokemonData[index].name} sprite`}
            />
            <p>
              <strong>Height:</strong> {pokemonData[index].height / 10} m
            </p>
            <p>
              <strong>Weight:</strong> {pokemonData[index].weight / 10} kg
            </p>
            <p>
              <strong>Types:</strong> {pokemonData[index].types.map((type) => type.type.name).join(", ")}
            </p>
            <h4>Stats:</h4>
            <ul>
              {pokemonData[index].stats.map((stat) => {
                const { statA, statB, diffA, diffB } = calculateStatDifferences(stat.stat.name);
                const diff = index === 0 ? diffA : diffB;

                return (
                  <li key={stat.stat.name}>
                    <strong>{stat.stat.name}:</strong> {stat.base_stat}
                    {diff !== 0 && (
                      <span style={{ marginLeft: "8px", color: diff > 0 ? "green" : "red" }}>
                        ({diff > 0 ? "+" : ""}{diff})
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            <button
              id="favorite"
              className={isFavorite ? "remove" : "add"}
              onClick={() => toggleFavorite(pokemonData[index])}
            >
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
