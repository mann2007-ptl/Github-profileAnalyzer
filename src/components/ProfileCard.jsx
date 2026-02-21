export default function ProfileCard({ profile }) {
    const joinedDate = new Date(profile.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="profile-card">
            <div className="profile-avatar-wrap">
                <img
                    src={profile.avatar_url}
                    alt={profile.login}
                    className="profile-avatar"
                />
                <div className="avatar-glow" />
            </div>

            <div className="profile-info">
                <h2 className="profile-name">{profile.name || profile.login}</h2>

                <a
                    href={profile.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-login"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    @{profile.login}
                </a>

                {/* Badges */}
                <div className="profile-badges">
                    {profile.hireable && (
                        <span className="badge badge-hireable">✅ Available for Hire</span>
                    )}
                    {profile.type && (
                        <span className="badge badge-type">{profile.type}</span>
                    )}
                </div>

                {profile.bio && <p className="profile-bio">{profile.bio}</p>}

                <div className="profile-meta">
                    {profile.location && (
                        <span className="meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            {profile.location}
                        </span>
                    )}
                    {profile.company && (
                        <span className="meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>
                            {profile.company}
                        </span>
                    )}
                    {profile.blog && (
                        <a
                            href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="meta-item meta-link"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                            </svg>
                            {profile.blog}
                        </a>
                    )}
                    {profile.twitter_username && (
                        <a
                            href={`https://twitter.com/${profile.twitter_username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="meta-item meta-link"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            @{profile.twitter_username}
                        </a>
                    )}
                    <span className="meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Joined {joinedDate}
                    </span>
                </div>

                <div className="profile-stats-row">
                    <div className="profile-stat">
                        <span className="stat-value">{profile.followers.toLocaleString()}</span>
                        <span className="stat-label">Followers</span>
                    </div>
                    <div className="profile-stat-divider" />
                    <div className="profile-stat">
                        <span className="stat-value">{profile.following.toLocaleString()}</span>
                        <span className="stat-label">Following</span>
                    </div>
                    <div className="profile-stat-divider" />
                    <div className="profile-stat">
                        <span className="stat-value">{profile.public_repos.toLocaleString()}</span>
                        <span className="stat-label">Repos</span>
                    </div>
                    <div className="profile-stat-divider" />
                    <div className="profile-stat">
                        <span className="stat-value">{profile.public_gists.toLocaleString()}</span>
                        <span className="stat-label">Gists</span>
                    </div>
                </div>

                <a
                    href={profile.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-link-btn"
                >
                    View on GitHub
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                </a>
            </div>
        </div>
    );
}
