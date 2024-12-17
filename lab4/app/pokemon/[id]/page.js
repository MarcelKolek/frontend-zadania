"use client";

import { useEffect, useState } from "react";
import PokemonDetails from "../../components/PokemonDetails";

const PokemonDetailPage = ({ params }) => {
  const { id } = params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error("Pokemon ID is undefined");
      setLoading(false);
      return;
    }

    const fetchPokemonDetails = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data = await response.json();
        setDetails(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Pokemon details:", error);
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!details) {
    return <p>Pokémon not found.</p>;
  }

  return <PokemonDetails details={details} />;
};

export default PokemonDetailPage;
