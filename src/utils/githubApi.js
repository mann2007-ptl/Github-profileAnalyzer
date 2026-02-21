const BASE_URL = "https://api.github.com";

export async function fetchUserEvents(username) {
  let allEvents = [];
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(
      `${BASE_URL}/users/${username}/events/public?per_page=100&page=${page}`
    );
    if (res.status === 403) throw new Error("RATE_LIMITED");
    if (!res.ok) break;
    const data = await res.json();
    if (!data.length) break;
    allEvents = allEvents.concat(data);
    if (data.length < 100) break;
  }
  return allEvents;
}

export async function fetchUserProfile(username) {
  const res = await fetch(`${BASE_URL}/users/${username}`);
  if (res.status === 404) throw new Error("USER_NOT_FOUND");
  if (res.status === 403) throw new Error("RATE_LIMITED");
  if (!res.ok) throw new Error("NETWORK_ERROR");
  return res.json();
}

export async function fetchUserRepos(username) {
  let allRepos = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `${BASE_URL}/users/${username}/repos?per_page=100&sort=updated&page=${page}`
    );
    if (res.status === 403) throw new Error("RATE_LIMITED");
    if (!res.ok) throw new Error("NETWORK_ERROR");
    const data = await res.json();
    if (data.length === 0) break;
    allRepos = allRepos.concat(data);
    if (data.length < 100) break;
    page++;
  }
  return allRepos;
}
