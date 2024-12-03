const pokemonURL = "https://pokeapi.co/api/v2/pokemon";
let currentPage = 1;
let totalPokemons = 0;

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch resource: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error during fetch:", error);
        alert("There was an error fetching data. Check the console for more details.");
    }
}

async function fetchPokemonList(page = 1) {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block';

    const limit = 20;
    const offset = (page - 1) * limit;
    
    const data = await fetchData(`${pokemonURL}?limit=${limit}&offset=${offset}`);
    if (data) {
        totalPokemons = data.count;
        const pokemonList = data.results;

        const pokemonUl = document.getElementById('pokemon-ul');
        pokemonUl.innerHTML = "";

        pokemonList.forEach(pokemon => {
            const listItem = document.createElement('li');
            listItem.classList.add('pokemon');
            listItem.dataset.name = pokemon.name;

            const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
            const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png`;

            listItem.innerHTML = `
                <h3>${pokemonName}</h3>
                <img src="${pokemonImage}" alt="${pokemonName}">
            `;

            listItem.addEventListener('click', () => showPokemonDetails(pokemon.name));

            pokemonUl.appendChild(listItem);
        });

        loadingElement.style.display = 'none';
    }
}

async function showPokemonDetails(pokemonName) {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block';

    const data = await fetchData(`${pokemonURL}/${pokemonName}`);

    const detailsElement = document.getElementById('details');
    detailsElement.innerHTML = `
        <h3>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h3>
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <p><strong>Height:</strong> ${data.height / 10} m</p>
        <p><strong>Weight:</strong> ${data.weight / 10} kg</p>
        <p><strong>Types:</strong> ${data.types.map(type => type.type.name).join(', ')}</p>
        <h4>Stats:</h4>
        <ul>
            ${data.stats.map(stat => `
                <li><strong>${stat.stat.name}:</strong> ${stat.base_stat}</li>
            `).join('')}
        </ul>
    `;

    loadingElement.style.display = 'none';
}

async function searchPokemon(query) {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block';

    const searchQuery = query.trim().toLowerCase();

    if (!searchQuery) {
        alert("Please enter a Pokémon name.");
        loadingElement.style.display = 'none';
        return;
    }

    try {
        const data = await fetchData(`${pokemonURL}?limit=1000`);
        const filteredPokemons = data.results.filter(pokemon => 
            pokemon.name.toLowerCase().includes(searchQuery)
        );

        const pokemonUl = document.getElementById('pokemon-ul');
        pokemonUl.innerHTML = "";

        if (filteredPokemons.length > 0) {
            filteredPokemons.forEach(pokemon => {
                const listItem = document.createElement('li');
                listItem.classList.add('pokemon');
                listItem.dataset.name = pokemon.name;

                const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
                const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png`;

                listItem.innerHTML = `
                    <h3>${pokemonName}</h3>
                    <img src="${pokemonImage}" alt="${pokemonName}">
                `;

                listItem.addEventListener('click', () => showPokemonDetails(pokemon.name));

                pokemonUl.appendChild(listItem);
            });
        } else {
            pokemonUl.innerHTML = `<li class="no-results">No Pokémon found with that name.</li>`;
        }

    } catch (error) {
        console.error("Search Error:", error);
        alert("There was an error fetching data.");
    }

    loadingElement.style.display = 'none';
}

document.getElementById('search').addEventListener('input', async function () {
    const searchQuery = this.value.trim();

    if (searchQuery) {
        await searchPokemon(searchQuery);
    } else {
        fetchPokemonList(1);
    }
});

document.getElementById('load-more').addEventListener('click', function () {
    if ((currentPage * 20) < totalPokemons) {
        currentPage++;
        fetchPokemonList(currentPage);
    } else {
        alert("No more Pokémon to load.");
    }
});

window.addEventListener('DOMContentLoaded', () => fetchPokemonList(1));