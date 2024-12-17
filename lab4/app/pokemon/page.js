"use client";

import { useState, useEffect } from "react";
import PokemonList from "../components/PokemonList";
import PokemonSearch from "../components/PokemonSearch";
import Filters from "../components/Filters";

const PokemonPage = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allPokemon, setAllPokemon] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000");
        const data = await response.json();
        
        const batchSize = 20;
        const updatedPokemonList = [];
        for (let i = 0; i < data.results.length; i += batchSize) {
          const batch = data.results.slice(i, i + batchSize);
          const batchDetails = await Promise.all(
            batch.map(async (pokemon) => {
              try {
                const pokemonDetailsResponse = await fetch(pokemon.url);
                if (!pokemonDetailsResponse.ok) {
                  throw new Error(`Failed to fetch details for ${pokemon.name}`);
                }
                const pokemonDetails = await pokemonDetailsResponse.json();
                return {
                  name: pokemon.name,
                  id: pokemonDetails.id,
                  types: pokemonDetails.types.map((type) => type.type.name),
                  sprites: pokemonDetails.sprites,
                };
              } catch (error) {
                return null;
              }
            })
          );
          updatedPokemonList.push(...batchDetails.filter((pokemon) => pokemon !== null));
        }

        setAllPokemon(updatedPokemonList);
        setPokemonList(updatedPokemonList.slice(0, 20));
        setFilteredPokemon(updatedPokemonList.slice(0, 20));
        setLoading(false);
      } catch (error) {
        console.log("Error fetching Pokémon:", error);
      }
    };

    fetchPokemonList();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);

    const filteredPokemons = allPokemon.filter((pokemon) => {
      const matchesType = selectedType ? pokemon.types.includes(selectedType) : true;
      const matchesSearch = query.trim()
        ? pokemon.name.toLowerCase().includes(query.toLowerCase())
        : true;
      return matchesType && matchesSearch;
    });

    setFilteredPokemon(filteredPokemons.slice(0, 20));
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);

    const filteredPokemons = allPokemon.filter((pokemon) => {
      const matchesType = type ? pokemon.types.includes(type) : true;
      const matchesSearch = searchQuery.trim()
        ? pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesType && matchesSearch;
    });

    setFilteredPokemon(filteredPokemons.slice(0, 20));
  };

  if (loading) {
    return <p>Loading Pokémon...</p>;
  }

  return (
    <main>
      <h2>Pokémon List</h2>
      <PokemonSearch onSearch={handleSearch} />
      <Filters selectedType={selectedType} onTypeChange={handleTypeChange} />
      <PokemonList pokemonList={filteredPokemon} />
    </main>
  );
};

export default PokemonPage;
