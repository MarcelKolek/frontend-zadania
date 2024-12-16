const PokemonSearch = ({ onSearch }) => {
    return (
        <form action="#" method="get">
            <input
                type="search"
                id="search"
                placeholder="Enter Pokémon name"
                onInput={(e) => onSearch(e.target.value)}
            />
        </form>
    );
};