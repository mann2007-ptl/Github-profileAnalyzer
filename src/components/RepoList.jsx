import { useState } from "react";

const SORT_OPTIONS = [
    { value: "updated", label: "Recently Updated" },
    { value: "stars", label: "Most Stars" },
    { value: "forks", label: "Most Forks" },
    { value: "name", label: "Name (A–Z)" },
];

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function formatSize(kb) {
    if (kb === 0) return "< 1 KB";
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
}

export default function RepoList({ repos }) {
    const [sortBy, setSortBy] = useState("updated");
    const [filter, setFilter] = useState("");
    const [showAll, setShowAll] = useState(false);
    const PAGE_SIZE = 10;

    const sorted = [...repos].sort((a, b) => {
        if (sortBy === "updated") return new Date(b.updated_at) - new Date(a.updated_at);
        if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
        if (sortBy === "forks") return b.forks_count - a.forks_count;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
    });

    const filtered = filter
        ? sorted.filter(
            (r) =>
                r.name.toLowerCase().includes(filter.toLowerCase()) ||
                (r.language && r.language.toLowerCase().includes(filter.toLowerCase())) ||
                (r.description && r.description.toLowerCase().includes(filter.toLowerCase()))
        )
        : sorted;

    const visible = showAll ? filtered : filtered.slice(0, PAGE_SIZE);

    return (
        <div className="repolist-section">
            <h3 className="section-title">Repositories</h3>

            <div className="repolist-controls">
                <input
                    type="text"
                    className="repo-filter-input"
                    placeholder="Filter by name, language or description…"
                    value={filter}
                    onChange={(e) => { setFilter(e.target.value); setShowAll(false); }}
                />
                <div className="sort-tabs">
                    {SORT_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            className={`sort-tab${sortBy === opt.value ? " active" : ""}`}
                            onClick={() => setSortBy(opt.value)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="repo-grid">
                {visible.map((repo) => (
                    <div className="repo-card" key={repo.id}>
                        {/* Header: name + badges */}
                        <div className="repo-card-header">
                            <div className="repo-name-wrap">
                                {repo.fork && <span className="fork-badge">Fork</span>}
                                <span className="repo-visibility-badge">
                                    {repo.visibility || "public"}
                                </span>
                                <a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="repo-name"
                                >
                                    {repo.name}
                                </a>
                            </div>
                            {repo.language && (
                                <span className="repo-lang">{repo.language}</span>
                            )}
                        </div>

                        {/* Description */}
                        {repo.description && (
                            <p className="repo-desc">{repo.description}</p>
                        )}

                        {/* Topics */}
                        {repo.topics && repo.topics.length > 0 && (
                            <div className="repo-topics">
                                {repo.topics.slice(0, 5).map((topic) => (
                                    <span key={topic} className="repo-topic">{topic}</span>
                                ))}
                                {repo.topics.length > 5 && (
                                    <span className="repo-topic">+{repo.topics.length - 5}</span>
                                )}
                            </div>
                        )}

                        {/* Extra details */}
                        <div className="repo-details">
                            {repo.open_issues_count > 0 && (
                                <span className="repo-detail-item">
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    {repo.open_issues_count} {repo.open_issues_count === 1 ? "issue" : "issues"}
                                </span>
                            )}
                            {repo.watchers_count > 0 && (
                                <span className="repo-detail-item">
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    {repo.watchers_count.toLocaleString()} watching
                                </span>
                            )}
                            {repo.size > 0 && (
                                <span className="repo-detail-item repo-size">
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                                    </svg>
                                    {formatSize(repo.size)}
                                </span>
                            )}
                            {repo.license && (
                                <span className="repo-detail-item repo-license">
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    {repo.license.spdx_id || repo.license.name}
                                </span>
                            )}
                        </div>

                        {/* Footer: stars, forks, dates */}
                        <div className="repo-card-footer">
                            <span className="repo-meta-item">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                                {repo.stargazers_count.toLocaleString()}
                            </span>
                            <span className="repo-meta-item">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
                                    <path d="M18 9a9 9 0 01-9 9" />
                                </svg>
                                {repo.forks_count.toLocaleString()}
                            </span>
                            <span className="repo-meta-item">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                Created {formatDate(repo.created_at)}
                            </span>
                            <span className="repo-meta-item repo-updated">
                                Updated {formatDate(repo.updated_at)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <p className="repo-empty">No repositories match your filter.</p>
            )}

            {filtered.length > PAGE_SIZE && !showAll && (
                <button className="load-more-btn" onClick={() => setShowAll(true)}>
                    Show all {filtered.length} repositories ↓
                </button>
            )}
            {showAll && filtered.length > PAGE_SIZE && (
                <button className="load-more-btn" onClick={() => setShowAll(false)}>
                    Show fewer ↑
                </button>
            )}
        </div>
    );
}
