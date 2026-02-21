import { useMemo } from "react";

function processEvents(events) {
    const pushEvents = events.filter((e) => e.type === "PushEvent");

    const now = new Date();
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(now.getDate() - 89);

    // Build a map of YYYY-MM-DD → commit count for the last 90 days
    const dailyMap = {};
    for (let i = 0; i < 90; i++) {
        const d = new Date(ninetyDaysAgo);
        d.setDate(ninetyDaysAgo.getDate() + i);
        dailyMap[d.toISOString().slice(0, 10)] = 0;
    }

    // Per-repo commit counts
    const repoMap = {};

    // Recent commits list
    const recentCommits = [];

    pushEvents.forEach((e) => {
        const date = e.created_at.slice(0, 10);
        const count = e.payload?.commits?.length || 0;
        if (count === 0) return;

        if (dailyMap[date] !== undefined) dailyMap[date] += count;

        const repoName = e.repo?.name || "unknown";
        repoMap[repoName] = (repoMap[repoName] || 0) + count;

        // Grab up to 3 commits per event for the timeline
        if (recentCommits.length < 30) {
            (e.payload?.commits || []).slice(0, 2).forEach((c) => {
                recentCommits.push({
                    repo: repoName,
                    sha: c.sha?.slice(0, 7),
                    message: c.message?.split("\n")[0],
                    date,
                    url: `https://github.com/${repoName}/commit/${c.sha}`,
                });
            });
        }
    });

    const days = Object.entries(dailyMap).map(([date, count]) => ({ date, count }));
    const maxCount = Math.max(...days.map((d) => d.count), 1);

    const totalCommits = pushEvents.reduce((s, e) => s + (e.payload?.commits?.length || 0), 0);

    const topRepos = Object.entries(repoMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

    // Event type breakdown
    const typeCounts = {};
    events.forEach((e) => {
        const label = e.type?.replace("Event", "") || "Unknown";
        typeCounts[label] = (typeCounts[label] || 0) + 1;
    });
    const topTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

    return { days, maxCount, totalCommits, topRepos, recentCommits, topTypes };
}

function CommitHeatmap({ days, maxCount }) {
    // Split into weeks (columns)
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    function getLevel(count) {
        if (count === 0) return 0;
        if (count <= maxCount * 0.25) return 1;
        if (count <= maxCount * 0.5) return 2;
        if (count <= maxCount * 0.75) return 3;
        return 4;
    }

    const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const DAY_LABELS = ["Sun", "Mon", "", "Wed", "", "Fri", ""];

    // Figure out month label positions
    const monthMarkers = [];
    weeks.forEach((week, wi) => {
        week.forEach((day) => {
            if (day.date && new Date(day.date).getDate() <= 7) {
                const m = new Date(day.date).getMonth();
                if (!monthMarkers.find((mm) => mm.month === m)) {
                    monthMarkers.push({ month: m, week: wi });
                }
            }
        });
    });

    return (
        <div className="heatmap-wrap">
            <div className="heatmap-month-labels">
                {monthMarkers.map(({ month, week }) => (
                    <span
                        key={`${month}-${week}`}
                        className="heatmap-month"
                        style={{ gridColumnStart: week + 1 }}
                    >
                        {MONTH_LABELS[month]}
                    </span>
                ))}
            </div>
            <div className="heatmap-body">
                <div className="heatmap-day-labels">
                    {DAY_LABELS.map((d, i) => (
                        <span key={i} className="heatmap-day-lbl">{d}</span>
                    ))}
                </div>
                <div className="heatmap-grid">
                    {weeks.map((week, wi) => (
                        <div key={wi} className="heatmap-week">
                            {week.map((day, di) => (
                                <div
                                    key={di}
                                    className={`heatmap-cell level-${getLevel(day.count)}`}
                                    title={`${day.date}: ${day.count} commit${day.count !== 1 ? "s" : ""}`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="heatmap-legend">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((l) => (
                    <div key={l} className={`heatmap-cell level-${l}`} />
                ))}
                <span>More</span>
            </div>
        </div>
    );
}

export default function ContributionActivity({ events, loading }) {
    const { days, maxCount, totalCommits, topRepos, recentCommits, topTypes } = useMemo(
        () => processEvents(events),
        [events]
    );

    const totalEvents = events.length;
    const pushCount = events.filter((e) => e.type === "PushEvent").length;

    return (
        <div className="contrib-section">
            <h3 className="section-title">Contribution Activity</h3>

            {loading && (
                <div className="contrib-loading">
                    <div className="loader-ring" style={{ width: 32, height: 32 }} />
                    <span>Loading activity…</span>
                </div>
            )}

            {!loading && totalEvents === 0 && (
                <p className="contrib-empty">No recent public activity found.</p>
            )}

            {!loading && totalEvents > 0 && (
                <>
                    {/* Summary pills */}
                    <div className="contrib-summary-row">
                        <div className="contrib-pill">
                            <span className="contrib-pill-value">{totalCommits.toLocaleString()}</span>
                            <span className="contrib-pill-label">Commits (90 days)</span>
                        </div>
                        <div className="contrib-pill">
                            <span className="contrib-pill-value">{pushCount}</span>
                            <span className="contrib-pill-label">Push Events</span>
                        </div>
                        <div className="contrib-pill">
                            <span className="contrib-pill-value">{totalEvents}</span>
                            <span className="contrib-pill-label">Total Events</span>
                        </div>
                        <div className="contrib-pill">
                            <span className="contrib-pill-value">{topRepos.length}</span>
                            <span className="contrib-pill-label">Active Repos</span>
                        </div>
                    </div>

                    {/* Heatmap */}
                    {totalCommits > 0 && (
                        <div className="contrib-card">
                            <h4 className="contrib-card-title">Commit Heatmap · Last 90 Days</h4>
                            <CommitHeatmap days={days} maxCount={maxCount} />
                        </div>
                    )}

                    <div className="contrib-two-col">
                        {/* Top repos by commits */}
                        {topRepos.length > 0 && (
                            <div className="contrib-card">
                                <h4 className="contrib-card-title">Top Repositories by Commits</h4>
                                <div className="contrib-repo-bars">
                                    {topRepos.map(([repo, count]) => {
                                        const pct = ((count / topRepos[0][1]) * 100).toFixed(1);
                                        const repoShort = repo.includes("/") ? repo.split("/")[1] : repo;
                                        return (
                                            <div key={repo} className="contrib-repo-row">
                                                <a
                                                    href={`https://github.com/${repo}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="contrib-repo-name"
                                                    title={repo}
                                                >
                                                    {repoShort}
                                                </a>
                                                <div className="contrib-bar-bg">
                                                    <div
                                                        className="contrib-bar-fill"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                                <span className="contrib-repo-count">{count}c</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Activity type breakdown */}
                        {topTypes.length > 0 && (
                            <div className="contrib-card">
                                <h4 className="contrib-card-title">Activity Breakdown</h4>
                                <div className="contrib-types">
                                    {topTypes.map(([type, count]) => (
                                        <div key={type} className="contrib-type-row">
                                            <span className="contrib-type-name">{type}</span>
                                            <div className="contrib-bar-bg">
                                                <div
                                                    className="contrib-bar-fill contrib-bar-cyan"
                                                    style={{ width: `${((count / totalEvents) * 100).toFixed(1)}%` }}
                                                />
                                            </div>
                                            <span className="contrib-repo-count">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recent commits timeline */}
                    {recentCommits.length > 0 && (
                        <div className="contrib-card">
                            <h4 className="contrib-card-title">Recent Commits</h4>
                            <ul className="commit-list">
                                {recentCommits.slice(0, 12).map((c, i) => (
                                    <li key={i} className="commit-item">
                                        <div className="commit-dot" />
                                        <div className="commit-body">
                                            <a
                                                href={c.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="commit-message"
                                            >
                                                {c.message || "(no message)"}
                                            </a>
                                            <span className="commit-meta">
                                                <span className="commit-repo">{c.repo?.split("/")[1] || c.repo}</span>
                                                &nbsp;·&nbsp;
                                                <code className="commit-sha">{c.sha}</code>
                                                &nbsp;·&nbsp;
                                                {c.date}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
