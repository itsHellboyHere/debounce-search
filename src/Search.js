import { useEffect, useState } from 'react';
const Search = () => {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [debounceQuery, setDebouncequery] = useState(query)
    const [errorMessage, setErrorMessage] = useState("");

    async function fetchResults(query) {
        const results = await fetch(`http://localhost:8080/api/v1/products/search?query=${query}`)
        console.log("results", results);

        const { data } = await results.json()
        console.log("data", data);

        return data;

    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncequery(query)
        }, 500)
        return () => clearTimeout(timer);
    }, [query])

    useEffect(() => {
        if (debounceQuery) {
            fetchResults(debounceQuery).then((data) => {
                if (data) {
                    setResults(data);     // Update results if data is not null
                    setErrorMessage("");  // Clear any previous error message
                } else {
                    setResults([]);       // Clear results
                    setErrorMessage("No products found"); // Show error message
                }
            });
        } else {
            setResults([]);
            setErrorMessage(""); // Clear error message if query is empty
        }
    }, [debounceQuery]);
    return (
        <div>

            <input

                name='query'
                type='text'
                value={query}
                placeholder='search'
                onChange={(e) => setQuery(e.target.value)}
            >
            </input>

            {
                errorMessage ? (
                    <p>
                        {errorMessage}
                    </p>
                ) : (
                    <ul>
                        {results.map((product) => (
                            <li key={product.id}>
                                <h3>{product.name}</h3>
                                <p>Brand: {product.brand}</p>
                                <p>{product.description}</p>
                                <p>Price: ${product.price}</p>
                            </li>
                        ))}
                    </ul>
                )
            }
        </div>
    )
}
export default Search