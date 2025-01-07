const PokemonSearch = ({ onSearch }) => {
    return (
      <div id="search-section">
        <form action="#" method="get">
          <input
            type="search"
            id="search"
            placeholder="Enter Pokémon name"
            onInput={(e) => onSearch(e.target.value)}
          />
        </form>
      </div>
    );
  };
  
  export default PokemonSearch;
  