import { useState, useEffect } from 'react'
import 'axios'
import axios from 'axios'
const DebounceSearch = () => {
    const [query, setQuery] = useState("")
    const [debounceQuery, setDebouncequery] = useState(query)
    const [suggestions, setSuggestions] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const fetchResults = async (query) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/products/suggestedproducts?query=${query}`)
            const data = response.data.data
            console.log(data);
            return data
        } catch (error) {
            console.log(error);
            return []

        }
    }
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncequery(query)
        }, 400)
        return () => clearTimeout(timeoutId)
    }, [query])

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debounceQuery) {
                setIsLoading(true)
                const data = await fetchResults(debounceQuery)
                console.log("Fetched Suggestions: ", data); // Log the fetc
                setSuggestions(data)
                setIsLoading(false)
            } else {
                setSuggestions([])
                setIsLoading(false)
            }
        }
        fetchSuggestions()
    }, [debounceQuery])
    return (
        <div style={{ position: 'relative', width: '300px' }}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products..."
                style={{ width: '100%', padding: '8px' }}
            />
            {isLoading && <p>Loading...</p>}
            {suggestions.length > 0 && (
                <ul style={{ listStyle: 'none', padding: '0', margin: '0', border: '1px solid #ddd', position: 'absolute', width: '100%', background: '#fff' }}>
                    {suggestions.map((product) => (
                        <li
                            key={product.id}
                            style={{ padding: '8px', cursor: 'pointer' }}
                            onClick={() => console.log(`Selected ${product.name}`)}
                        >
                            {product.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default DebounceSearch