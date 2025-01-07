"use client";

import { useEffect, useState } from "react";
import PokemonDetails from "../../components/PokemonDetails";

const PokemonDetailPage = ({ params }) => {
  const { id } = params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error("Invalid Pokémon ID");
      setLoading(false);
      return;
    }

    const fetchPokemonDetails = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch Pokémon with ID ${id}`);
        const data = await response.json();
        setDetails({
          id: data.id,
          name: data.name,
          sprites: data.sprites,
          height: data.height,
          weight: data.weight,
          types: data.types,
          stats: data.stats,
        });
      } catch (error) {
        console.error("Error fetching Pokémon details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!details) return <p>Pokémon not found.</p>;

  return <PokemonDetails details={details} />;
};

export default PokemonDetailPage;
