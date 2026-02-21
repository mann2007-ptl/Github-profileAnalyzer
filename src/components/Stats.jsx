export default function Stats({ repos }) {
    const totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
    const totalForks = repos.reduce((acc, r) => acc + r.forks_count, 0);
    const totalWatchers = repos.reduce((acc, r) => acc + r.watchers_count, 0);

    // Language counts
    const langMap = {};
    repos.forEach((r) => {
        if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
    });
    const topLang = Object.entries(langMap).sort((a, b) => b[1] - a[1])[0];

    // Most starred
    const mostStarred = repos.reduce(
        (best, r) => (!best || r.stargazers_count > best.stargazers_count ? r : best),
        null
    );

    // Recently updated
    const recentlyUpdated = repos.reduce(
        (best, r) => (!best || new Date(r.updated_at) > new Date(best.updated_at) ? r : best),
        null
    );

    const forked = repos.filter((r) => r.fork).length;
    const original = repos.length - forked;

    const statItems = [
        { label: "Total Repositories", value: repos.length, icon: "📁" },
        { label: "Total Stars", value: totalStars.toLocaleString(), icon: "⭐" },
        { label: "Total Forks", value: totalForks.toLocaleString(), icon: "🍴" },
        { label: "Watchers", value: totalWatchers.toLocaleString(), icon: "👁️" },
        { label: "Top Language", value: topLang ? topLang[0] : "—", icon: "💻" },
        { label: "Original Repos", value: original, icon: "🔨" },
        { label: "Forked Repos", value: forked, icon: "↗️" },
    ];

    return (
        <div className="stats-section">
            <h3 className="section-title">Repository Analytics</h3>

            <div className="stats-grid">
                {statItems.map((item, idx) => (
                    <div className="stat-card" key={item.label} style={{ animationDelay: `${idx * 0.05}s` }}>
                        <span className="stat-card-icon">{item.icon}</span>
                        <span className="stat-card-value">{item.value}</span>
                        <span className="stat-card-label">{item.label}</span>
                    </div>
                ))}
            </div>

            {/* Highlight cards */}
            <div className="highlight-cards">
                {mostStarred && (
                    <div className="highlight-card">
                        <span className="highlight-badge">⭐ Most Starred</span>
                        <a
                            href={mostStarred.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="highlight-repo-name"
                        >
                            {mostStarred.name}
                        </a>
                        <span className="highlight-meta">
                            {mostStarred.stargazers_count.toLocaleString()} stars
                            {mostStarred.language && ` · ${mostStarred.language}`}
                        </span>
                        {mostStarred.description && (
                            <p className="highlight-desc">{mostStarred.description}</p>
                        )}
                    </div>
                )}
                {recentlyUpdated && (
                    <div className="highlight-card">
                        <span className="highlight-badge">🕐 Recently Updated</span>
                        <a
                            href={recentlyUpdated.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="highlight-repo-name"
                        >
                            {recentlyUpdated.name}
                        </a>
                        <span className="highlight-meta">
                            Updated {new Date(recentlyUpdated.updated_at).toLocaleDateString("en-US", {
                                year: "numeric", month: "short", day: "numeric",
                            })}
                            {recentlyUpdated.language && ` · ${recentlyUpdated.language}`}
                        </span>
                        {recentlyUpdated.description && (
                            <p className="highlight-desc">{recentlyUpdated.description}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Language breakdown bars */}
            {Object.keys(langMap).length > 0 && (
                <div className="lang-breakdown">
                    <h4 className="lang-breakdown-title">Language Breakdown</h4>
                    <div className="lang-bars">
                        {Object.entries(langMap)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 8)
                            .map(([lang, count]) => {
                                const pct = ((count / repos.length) * 100).toFixed(1);
                                return (
                                    <div className="lang-bar-row" key={lang}>
                                        <span className="lang-name">{lang}</span>
                                        <div className="lang-bar-bg">
                                            <div
                                                className="lang-bar-fill"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="lang-count">{count} repo{count !== 1 ? "s" : ""}</span>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
}
