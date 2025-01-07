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
    const storedType = typeof window !== "undefined" ? localStorage.getItem("selectedType") : null;
    if (storedType) setSelectedType(storedType);
  }, []);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=200");
        if (!response.ok) throw new Error("Failed to fetch Pokémon list");
        const data = await response.json();

        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            try {
              const detailsResponse = await fetch(pokemon.url);
              if (!detailsResponse.ok) throw new Error();
              const details = await detailsResponse.json();
              return {
                id: details.id,
                name: details.name,
                types: details.types.map((type) => type.type.name),
                sprites: details.sprites,
              };
            } catch {
              return null;
            }
          })
        );

        const validPokemon = pokemonDetails.filter((pokemon) => pokemon !== null);
        setAllPokemon(validPokemon);
        setPokemonList(validPokemon.slice(0, 20));
        setFilteredPokemon(validPokemon.slice(0, 20));
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonList();
  }, []);

  useEffect(() => {
    const filtered = allPokemon.filter((pokemon) => {
      const matchesType = selectedType ? pokemon.types.includes(selectedType) : true;
      const matchesSearch = searchQuery.trim()
        ? pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesType && matchesSearch;
    });

    setFilteredPokemon(filtered.slice(0, 20));
  }, [allPokemon, selectedType, searchQuery]);

  const handleSearch = (query) => setSearchQuery(query);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    localStorage.setItem("selectedType", type || "");
  };

  if (loading) return <p>Loading Pokémon...</p>;

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
