const PokemonList = ({ pokemonList, onPokemonClick }) => {
    return (
        <ul id="pokemon-ul">
            {pokemonList.length > 0 ? (
                pokemonList.map((pokemon) => (
                    <li
                        key={pokemon.name}
                        className="pokemon"
                        data-name={pokemon.name}
                        onClick={() => onPokemonClick(pokemon.name)}
                    >
                        <h3>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                        <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                            alt={pokemon.name}
                        />
                    </li>
                ))
            ) : (
                <li className="no-results">No Pokémon found.</li>
            )}
        </ul>
    );
};