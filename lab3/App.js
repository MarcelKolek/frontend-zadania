let pokemonList = [];
let selectedPokemonDetails = null;
let loading = false;

const App = ({ pokemonList, onSearch, onPokemonClick, selectedPokemonDetails, loading }) => {
    return (
        <div>
            <header>
                <h1>PokéApp</h1>
            </header>

            <section id="search-section">
                <h2>Search Pokémon:</h2>
                <PokemonSearch onSearch={onSearch} />
            </section>

            <section id="pokemon-list">
                <h2>Pokémon List</h2>
                <PokemonList pokemonList={pokemonList} onPokemonClick={onPokemonClick} />
            </section>

            <section id="pokemon-details">
                <h2>Pokémon details</h2>
                <PokemonDetails details={selectedPokemonDetails} />
            </section>

            {loading && <div id="loading">Loading...</div>}
        </div>
    );
};

const fetchPokemonList = async (page = 1) => {
    loading = true;
    const limit = 20;
    const offset = (page - 1) * limit;
    const data = await fetchData(`${pokemonURL}?limit=${limit}&offset=${offset}`);

    if (data) {
        pokemonList = data.results.map((pokemon, index) => ({
            name: pokemon.name,
            id: index + offset + 1,
        }));

        loading = false;
        renderApp();
    }
};

const fetchPokemonDetails = async (pokemonName) => {
    const isPokemonInList = pokemonList.some(pokemon => pokemon.name === pokemonName);
    if (isPokemonInList) {
        loading = true;
        selectedPokemonDetails = await fetchData(`${pokemonURL}/${pokemonName}`);
        loading = false;
        renderApp();
    }
};

const handleSearch = async (query) => {
    if (!query.trim()) {
        await fetchPokemonList(1);
        return;
    }

    loading = true;
    const data = await fetchData(`${pokemonURL}?limit=10000`);

    if (data) {
        const filteredPokemons = data.results.filter(pokemon => 
            pokemon.name.toLowerCase().includes(query.toLowerCase())
        );
        pokemonList = await Promise.all(
            filteredPokemons.slice(0, 20).map(async (pokemon) => {
                const details = await fetchData(pokemon.url);
                return {
                    name: pokemon.name,
                    id: details.id,
                };
            })
        );

        if (selectedPokemonDetails && !pokemonList.some(pokemon => pokemon.name === selectedPokemonDetails.name)) {
            selectedPokemonDetails = null;
        }

        loading = false;
        renderApp();
    }
};

const renderApp = () => {
    ReactDOM.render(
        <App
            pokemonList={pokemonList}
            onSearch={handleSearch}
            onPokemonClick={fetchPokemonDetails}
            selectedPokemonDetails={selectedPokemonDetails}
            loading={loading}
        />, 
        document.getElementById('root')
    );
};

const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error during fetch:", error);
        alert("There was an error fetching data. Check the console for more details.");
    }
};

const pokemonURL = "https://pokeapi.co/api/v2/pokemon";
fetchPokemonList(1);
