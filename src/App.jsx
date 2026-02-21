import { useState } from "react";
import SearchBar from "./components/SearchBar";
import ProfileCard from "./components/ProfileCard";
import Stats from "./components/Stats";
import LanguageChart from "./components/LanguageChart";
import RepoList from "./components/RepoList";
import ContributionActivity from "./components/ContributionActivity";
import { fetchUserProfile, fetchUserRepos, fetchUserEvents } from "./utils/githubApi";
import "./App.css";

function ErrorBanner({ error }) {
  const messages = {
    USER_NOT_FOUND: {
      title: "User Not Found",
      desc: "No GitHub account with that username could be found. Please double-check and try again.",
      icon: "🔍",
    },
    RATE_LIMITED: {
      title: "API Rate Limit Reached",
      desc: "GitHub's unauthenticated API limit has been exceeded. Please wait a few minutes and try again.",
      icon: "⏳",
    },
    NETWORK_ERROR: {
      title: "Network Error",
      desc: "Could not reach the GitHub API. Please check your internet connection.",
      icon: "📡",
    },
  };
  const info = messages[error] || { title: "Unexpected Error", desc: error, icon: "❌" };
  return (
    <div className="error-banner">
      <span className="error-icon">{info.icon}</span>
      <div>
        <strong>{info.title}</strong>
        <p>{info.desc}</p>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="loader-wrap">
      <div className="loader-ring" />
      <p className="loader-text">Fetching GitHub data…</p>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [events, setEvents] = useState([]);

  async function handleSearch(username) {
    setLoading(true);
    setEventsLoading(true);
    setError(null);
    setProfile(null);
    setRepos([]);
    setEvents([]);

    try {
      // Fetch profile + repos first (show them fast)
      const [profileData, reposData] = await Promise.all([
        fetchUserProfile(username),
        fetchUserRepos(username),
      ]);
      setProfile(profileData);
      setRepos(reposData);
      setLoading(false);

      // Fetch events in the background (can be slower — 3 pages)
      const eventsData = await fetchUserEvents(username);
      setEvents(eventsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setEventsLoading(false);
    }
  }

  return (
    <div className="app">
      {/* Hero Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-logo">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="header-logo-gradient">GitHub Profile Analyzer</span>
          </div>
          <p className="header-tagline">
            Transform any GitHub profile into meaningful insights
          </p>
        </div>
      </header>

      <main className="app-main">
        <SearchBar onSearch={handleSearch} loading={loading} />

        {loading && <Loader />}
        {error && !loading && <ErrorBanner error={error} />}

        {profile && !loading && (
          <>
            <ProfileCard profile={profile} />

            {/* Contribution Activity (events data) */}
            <ContributionActivity events={events} loading={eventsLoading} />

            {repos.length > 0 && (
              <>
                <div className="analytics-grid">
                  <Stats repos={repos} />
                  <LanguageChart repos={repos} />
                </div>
                <RepoList repos={repos} />
              </>
            )}

            {repos.length === 0 && (
              <div className="no-repos">
                <p>This user has no public repositories yet.</p>
              </div>
            )}
          </>
        )}

        {!profile && !loading && !error && (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </div>
            <h2>Analyze any GitHub Profile</h2>
            <p>
              Enter a username like <code>torvalds</code> or paste a full profile URL to get started.
            </p>
            <div className="example-users">
              {["torvalds", "gaearon", "sindresorhus", "yyx990803"].map((u) => (
                <button
                  key={u}
                  className="example-chip"
                  onClick={() => handleSearch(u)}
                >
                  @{u}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Built with React · Data from{" "}
          <a href="https://docs.github.com/en/rest" target="_blank" rel="noopener noreferrer">
            GitHub REST API
          </a>
        </p>
      </footer>
    </div>
  );
}
