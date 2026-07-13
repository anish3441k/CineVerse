const TMDB_IMG = "https://image.tmdb.org/t/p/original";
const TMDB_POSTER = "https://image.tmdb.org/t/p/w500";
const TMDB_PROFILE = "https://image.tmdb.org/t/p/w300";

const urlParams = new URLSearchParams(window.location.search);
const seriesId = urlParams.get("id") || "1399"; // fallback example: Game of Thrones

let selectedMeter = "";

/* -------------------------------------------------------
   OPTIONAL: Custom awards mapping for series
   Add real data here whenever you want
------------------------------------------------------- */
const SERIES_AWARDS = {
  // Example:
  // 1399: { wins: 59, nominations: 160 }, // Game of Thrones
  // 66732: { wins: 12, nominations: 50 }  // Stranger Things example
};

document.addEventListener("DOMContentLoaded", () => {
  bindSidebar();
  initSeriesDetail();
  setupMeterButtons();

  document.getElementById("watchNowBtn").addEventListener("click", openWatchPage);
  document.getElementById("submitReviewBtn").addEventListener("click", submitReview);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSidebar();
  });
});

/* -------------------------------------------------------
   SIDEBAR
------------------------------------------------------- */
function bindSidebar() {
  const menuBtn = document.getElementById("menuBtn");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  if (menuBtn) {
    menuBtn.addEventListener("click", toggleSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
  }
}

function goHome() {
  window.location.href = "index.html";
}

function navigateAndClose(page) {
  closeSidebar();
  setTimeout(() => {
    window.location.href = page;
  }, 120);
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");

  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");

  sidebar.classList.remove("active");
  overlay.classList.remove("active");
}

/* -------------------------------------------------------
   INIT
------------------------------------------------------- */
async function initSeriesDetail() {
  try {
    const [series, credits, videos, images, similar, providers] = await Promise.all([
      tmdb(`/tv/${seriesId}`),
      tmdb(`/tv/${seriesId}/credits`),
      tmdb(`/tv/${seriesId}/videos`),
      tmdb(`/tv/${seriesId}/images`),
      tmdb(`/tv/${seriesId}/similar`),
      tmdb(`/tv/${seriesId}/watch/providers`)
    ]);

    renderSeries(series);
    renderCrew(series, credits);
    renderCast(credits);
    renderTrailer(videos);
    renderScreenshots(images);
    renderSimilar(similar);
    renderProviders(providers);

  } catch (error) {
    console.error("Web series detail error:", error);
    document.getElementById("seriesTitle").textContent = "Failed to load web series details";
    document.getElementById("seriesOverview").textContent =
      "Something went wrong while loading this page.";
  }
}

async function tmdb(path) {
  const res = await fetch(`/api/tmdb?path=${encodeURIComponent(path)}`);
  if (!res.ok) throw new Error(`TMDB proxy error: ${res.status}`);
  return res.json();
}

/* -------------------------------------------------------
   THEME + SERIES DATA
------------------------------------------------------- */
function renderSeries(series) {
  document.getElementById("seriesTitle").textContent = series.name || "Untitled";
  document.getElementById("seriesTagline").textContent =
    series.tagline || "No tagline available.";
  document.getElementById("seriesOverview").textContent =
    series.overview || "No overview available.";

  document.getElementById("seriesPoster").src = series.poster_path
    ? `${TMDB_POSTER}${series.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  document.getElementById("detailBackdrop").style.backgroundImage = series.backdrop_path
    ? `url(${TMDB_IMG}${series.backdrop_path})`
    : "linear-gradient(135deg,#111827,#0f172a)";

  document.getElementById("seriesRating").textContent =
    series.vote_average ? series.vote_average.toFixed(1) : "0.0";

  document.getElementById("seriesVotes").textContent =
    series.vote_count ? series.vote_count.toLocaleString() : "0";

  document.getElementById("seriesFirstYear").textContent =
    series.first_air_date ? series.first_air_date.slice(0, 4) : "----";

  document.getElementById("seriesSeasonsMeta").textContent =
    `${series.number_of_seasons || 0} Seasons`;

  document.getElementById("seriesEpisodesMeta").textContent =
    `${series.number_of_episodes || 0} Episodes`;

  document.getElementById("seriesStatusMeta").textContent =
    series.status || "Unknown";

  const genresWrap = document.getElementById("seriesGenres");
  genresWrap.innerHTML = "";
  (series.genres || []).forEach(genre => {
    const chip = document.createElement("span");
    chip.className = "genre-chip";
    chip.textContent = genre.name;
    genresWrap.appendChild(chip);
  });

  /* 4-card strip */
  const awards = SERIES_AWARDS[series.id];
  document.getElementById("seriesAwardsWon").textContent =
    awards?.wins ?? "--";
  document.getElementById("seriesNominations").textContent =
    awards?.nominations ?? "--";

  document.getElementById("seriesSeasons").textContent =
    series.number_of_seasons ?? "—";

  document.getElementById("seriesEpisodes").textContent =
    series.number_of_episodes ?? "—";

  /* Poster/backdrop based theme tint */
  applyThemeFromSeries(series);
}

function applyThemeFromSeries(series) {
  const title = (series.name || "").toLowerCase();
  const genres = (series.genres || []).map(g => g.name.toLowerCase());

  let primary = "#7c3aed";
  let secondary = "#06b6d4";
  let glow = "rgba(124,58,237,0.35)";

  // simple genre/title-based theme tuning
  if (genres.includes("sci-fi & fantasy") || genres.includes("science fiction")) {
    primary = "#2563eb";
    secondary = "#06b6d4";
    glow = "rgba(37,99,235,0.35)";
  } else if (genres.includes("mystery") || genres.includes("crime")) {
    primary = "#4f46e5";
    secondary = "#7c3aed";
    glow = "rgba(79,70,229,0.34)";
  } else if (genres.includes("drama")) {
    primary = "#8b5cf6";
    secondary = "#ec4899";
    glow = "rgba(139,92,246,0.30)";
  } else if (genres.includes("action & adventure")) {
    primary = "#7c3aed";
    secondary = "#0891b2";
    glow = "rgba(124,58,237,0.34)";
  } else if (genres.includes("comedy")) {
    primary = "#9333ea";
    secondary = "#14b8a6";
    glow = "rgba(147,51,234,0.30)";
  }

  // title-based small flavor override if you want stronger identity for some famous series
  if (title.includes("stranger things")) {
    primary = "#7c2d12";
    secondary = "#b91c1c";
    glow = "rgba(185,28,28,0.32)";
  } else if (title.includes("dark")) {
    primary = "#312e81";
    secondary = "#4338ca";
    glow = "rgba(67,56,202,0.32)";
  } else if (title.includes("wednesday")) {
    primary = "#4c1d95";
    secondary = "#6d28d9";
    glow = "rgba(109,40,217,0.30)";
  }

  document.documentElement.style.setProperty("--theme-primary", primary);
  document.documentElement.style.setProperty("--theme-secondary", secondary);
  document.documentElement.style.setProperty("--theme-glow", glow);
}

/* -------------------------------------------------------
   CREW / CAST / TRAILER / PROVIDERS
------------------------------------------------------- */
function renderCrew(series, credits) {
  const crewContainer = document.getElementById("importantCrew");
  crewContainer.innerHTML = "";

  const finalCrew = [];

  if (series.created_by && series.created_by.length) {
    finalCrew.push({
      role: "Creator",
      name: series.created_by[0].name
    });
  }

  const crew = credits.crew || [];

  const wanted = [
    { job: "Writer", label: "Writer" },
    { job: "Screenplay", label: "Screenplay" },
    { job: "Original Music Composer", label: "Music" },
    { job: "Producer", label: "Producer" },
    { job: "Executive Producer", label: "Executive Producer" }
  ];

  const usedNames = new Set(finalCrew.map(x => x.name));

  wanted.forEach(item => {
    const found = crew.find(c => c.job === item.job && !usedNames.has(c.name));
    if (found) {
      usedNames.add(found.name);
      finalCrew.push({
        role: item.label,
        name: found.name
      });
    }
  });

  if (!finalCrew.length) {
    crewContainer.innerHTML = `<div class="empty-state">Crew info not available.</div>`;
    return;
  }

  finalCrew.forEach(member => {
    const card = document.createElement("div");
    card.className = "crew-card";
    card.innerHTML = `
      <div class="crew-role">${member.role}</div>
      <div class="crew-name">${member.name}</div>
    `;
    crewContainer.appendChild(card);
  });
}

function renderCast(credits) {
  const castContainer = document.getElementById("topCast");
  castContainer.innerHTML = "";

  const cast = (credits.cast || []).slice(0, 12);

  if (!cast.length) {
    castContainer.innerHTML = `<div class="empty-state">Cast not available.</div>`;
    return;
  }

  cast.forEach(person => {
    const img = person.profile_path
      ? `${TMDB_PROFILE}${person.profile_path}`
      : "https://via.placeholder.com/300x450?text=No+Image";

    const card = document.createElement("div");
    card.className = "cast-card";
    card.innerHTML = `
      <img src="${img}" alt="${person.name}">
      <div class="cast-info">
        <div class="cast-name">${person.name}</div>
        <div class="cast-character">${person.character || "—"}</div>
      </div>
    `;
    castContainer.appendChild(card);
  });
}

function renderTrailer(videos) {
  const trailerBox = document.getElementById("trailerBox");
  const results = videos.results || [];

  const trailer = results.find(v =>
    v.site === "YouTube" &&
    (v.type === "Trailer" || v.type === "Teaser")
  );

  if (!trailer) {
    trailerBox.innerHTML = `<div class="trailer-placeholder">Trailer not available.</div>`;
    return;
  }

  trailerBox.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${trailer.key}"
      title="Web Series Trailer"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;
}

function renderProviders(data) {
  const container = document.getElementById("watchProviders");
  container.innerHTML = "";

  const results = data.results || {};
  const india = results.IN || results.US || null;

  if (!india) {
    container.innerHTML = `<div class="empty-state">Watch provider info not available.</div>`;
    return;
  }

  const providerMap = new Map();

  ["flatrate", "rent", "buy"].forEach(type => {
    (india[type] || []).forEach(p => {
      if (!providerMap.has(p.provider_id)) {
        providerMap.set(p.provider_id, p);
      }
    });
  });

  const providers = Array.from(providerMap.values()).slice(0, 12);

  if (!providers.length) {
    container.innerHTML = `<div class="empty-state">No providers available.</div>`;
    return;
  }

  providers.forEach(provider => {
    const logo = provider.logo_path
      ? `${TMDB_POSTER}${provider.logo_path}`
      : "https://via.placeholder.com/80?text=OTT";

    const card = document.createElement("div");
    card.className = "provider-card";
    card.innerHTML = `
      <img src="${logo}" alt="${provider.provider_name}">
      <span>${provider.provider_name}</span>
    `;
    container.appendChild(card);
  });
}

function renderScreenshots(images) {
  const container = document.getElementById("screenshotsGrid");
  container.innerHTML = "";

  const backdrops = (images.backdrops || []).slice(0, 8);

  if (!backdrops.length) {
    container.innerHTML = `<div class="empty-state">Screenshots not available.</div>`;
    return;
  }

  backdrops.forEach(img => {
    const imageUrl = `${TMDB_IMG}${img.file_path}`;
    const card = document.createElement("div");
    card.className = "screenshot-card";
    card.innerHTML = `<img src="${imageUrl}" alt="Screenshot">`;
    container.appendChild(card);
  });
}

function renderSimilar(similarData) {
  const container = document.getElementById("similarSeries");
  container.innerHTML = "";

  const seriesList = (similarData.results || []).slice(0, 8);

  if (!seriesList.length) {
    container.innerHTML = `<div class="empty-state">Similar web series not available.</div>`;
    return;
  }

  seriesList.forEach(series => {
    const poster = series.poster_path
      ? `${TMDB_POSTER}${series.poster_path}`
      : "https://via.placeholder.com/400x600?text=No+Poster";

    const card = document.createElement("div");
    card.className = "similar-card";
    card.innerHTML = `
      <img src="${poster}" alt="${series.name}">
      <div class="similar-info">
        <div class="similar-title">${series.name}</div>
        <div class="similar-meta">${series.first_air_date ? series.first_air_date.slice(0,4) : "----"} • ⭐ ${series.vote_average ? series.vote_average.toFixed(1) : "0.0"}</div>
      </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `series-detail.html?id=${series.id}`;
    });

    container.appendChild(card);
  });
}

/* -------------------------------------------------------
   REVIEW METER
------------------------------------------------------- */
function setupMeterButtons() {
  const meterButtons = document.querySelectorAll(".meter-btn");
  meterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      meterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedMeter = btn.dataset.value;
    });
  });
}

function submitReview() {
  const review = document.getElementById("userReview").value.trim();

  if (!selectedMeter && !review) {
    alert("Please choose a rating or write a review first.");
    return;
  }

  const list = document.getElementById("userReviewsList");
  const card = document.createElement("div");
  card.className = "review-card";

  const meterLabel = formatMeterLabel(selectedMeter || "average");

  card.innerHTML = `
    <div class="review-card-top">
      <strong>You</strong>
      <span class="review-meter-tag ${selectedMeter || "average"}">${meterLabel}</span>
    </div>
    <p>${review || "No written review added."}</p>
  `;
  list.prepend(card);

  document.getElementById("userReview").value = "";
  selectedMeter = "";
  document.querySelectorAll(".meter-btn").forEach(b => b.classList.remove("active"));
}

function formatMeterLabel(value) {
  if (value === "worst") return "Worst";
  if (value === "average") return "Average";
  if (value === "good") return "Good";
  if (value === "super") return "Super";
  return "Average";
}

/* -------------------------------------------------------
   WATCH PAGE
------------------------------------------------------- */
function openWatchPage() {
  window.location.href = `watch-series.html?type=tv&id=${seriesId}`;
}