import { useParams } from 'react-router-dom';
import styles from './SearchResults.module.css';
import { useState, useEffect } from 'react';
import { getJson } from 'serpapi';

interface SearchResult {
    position: number;
    title: string;
    link: string;
    displayed_link: string;
    snippet: string;
    favicon?: string;
    thumbnail?: string;
}

export default function SearchResults() {
    const { query } = useParams();
    const [results, setResults] = useState<SearchResult[]>([]);

    useEffect(() => {
        if (!query) return;
        const fetchResults = async () => {
            const response = await fetch(
                `http://localhost:3000/api/search?q=${query}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const data = await response.json();
            setResults(data);
        };

        fetchResults();
    }, [query]);

    return (
        <div className={styles.container}>
            <div className={styles.searchHeader}>
                <h1>{query}</h1>
                <button className={styles.editQuery}>Edit Query</button>
            </div>

            <div className={styles.resultsSection}>
                <h2>Sources</h2>
                {results.map((result) => (
                    <div key={result.position} className={styles.resultCard}>
                        <div className={styles.resultHeader}>
                            {result.favicon && (
                                <img
                                    src={result.favicon}
                                    alt=""
                                    className={styles.favicon}
                                />
                            )}
                            <h3>
                                <a
                                    href={result.link}
                                    className={styles.resultTitle}
                                >
                                    {result.title}
                                </a>
                            </h3>
                        </div>
                        <span className={styles.resultUrl}>
                            {result.displayed_link}
                        </span>
                        <p className={styles.resultDescription}>
                            {result.snippet}
                        </p>
                        {result.thumbnail && (
                            <img
                                src={result.thumbnail}
                                alt=""
                                className={styles.thumbnail}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
