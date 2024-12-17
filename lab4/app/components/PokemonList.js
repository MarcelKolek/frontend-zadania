import Link from 'next/link';

const PokemonList = ({ pokemonList }) => {
  return (
    <ul id="pokemon-ul">
      {pokemonList.length > 0 ? (
        pokemonList.map((pokemon) => {
          if (!pokemon.id || !pokemon.name) {
            console.error("Missing id or name for Pokémon:", pokemon);
            return null;
          }

          return (
            <li key={pokemon.name} className="pokemon">
              <Link href={`/pokemon/${pokemon.id}`}>
                <h3>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                  alt={pokemon.name}
                />
              </Link>
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
