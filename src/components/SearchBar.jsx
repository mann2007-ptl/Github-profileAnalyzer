import { useState } from "react";

function extractUsername(input) {
    const trimmed = input.trim();
    // Match https://github.com/username or github.com/username
    const urlMatch = trimmed.match(/github\.com\/([a-zA-Z0-9_-]+)\/?/);
    if (urlMatch) return urlMatch[1];
    // Otherwise treat as plain username
    return trimmed;
}

export default function SearchBar({ onSearch, loading }) {
    const [input, setInput] = useState("");
    const [validationError, setValidationError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (!input.trim()) {
            setValidationError("Please enter a GitHub username or profile URL.");
            return;
        }
        setValidationError("");
        const username = extractUsername(input);
        if (!username) {
            setValidationError("Could not extract a username. Please try again.");
            return;
        }
        onSearch(username);
    }

    return (
        <div className="search-wrapper">
            <form className="search-form" onSubmit={handleSubmit}>
                <div className="search-input-group">
                    <span className="search-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Enter GitHub username or profile URL…"
                        value={input}
                        onChange={(e) => { setInput(e.target.value); setValidationError(""); }}
                        disabled={loading}
                        spellCheck={false}
                    />
                    <button
                        type="submit"
                        className="search-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="btn-spinner" />
                        ) : (
                            "Analyze"
                        )}
                    </button>
                </div>
                {validationError && (
                    <p className="search-validation-error">{validationError}</p>
                )}
            </form>
        </div>
    );
}
