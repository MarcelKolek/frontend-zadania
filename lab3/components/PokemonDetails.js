const PokemonDetails = ({ details }) => {
    if (!details) {
        return <p>Select Pokémon to show details.</p>;
    }

    return (
        <div>
            <h3>{details.name.charAt(0).toUpperCase() + details.name.slice(1)}</h3>
            <img src={details.sprites.front_default} alt={details.name} />
            <p><strong>Height:</strong> {details.height / 10} m</p>
            <p><strong>Weight:</strong> {details.weight / 10} kg</p>
            <p><strong>Types:</strong> {details.types.map(type => type.type.name).join(', ')}</p>
            <h4>Stats:</h4>
            <ul>
                {details.stats.map(stat => (
                    <li key={stat.stat.name}><strong>{stat.stat.name}:</strong> {stat.base_stat}</li>
                ))}
            </ul>
        </div>
    );
};