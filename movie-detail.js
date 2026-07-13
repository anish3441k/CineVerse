const TMDB_IMG = "https://image.tmdb.org/t/p/original";
const TMDB_POSTER = "https://image.tmdb.org/t/p/w500";
const TMDB_PROFILE = "https://image.tmdb.org/t/p/w300";

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id") || "157336";

let selectedMeter = "";

document.addEventListener("DOMContentLoaded", () => {
  initMovieDetail();
  setupMeterButtons();

  document.getElementById("watchNowBtn").addEventListener("click", openWatchPage);
  document.getElementById("submitReviewBtn").addEventListener("click", submitReview);

  // optional: close sidebar on escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSidebar();
  });
});

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
  document.getElementById("sidebar").classList.remove("active");
  document.getElementById("sidebarOverlay").classList.remove("active");
}

async function initMovieDetail() {
  try {
    const [movie, credits, videos, images, similar, providers] = await Promise.all([
      tmdb(`/movie/${movieId}`),
      tmdb(`/movie/${movieId}/credits`),
      tmdb(`/movie/${movieId}/videos`),
      tmdb(`/movie/${movieId}/images`),
      tmdb(`/movie/${movieId}/similar`),
      tmdb(`/movie/${movieId}/watch/providers`)
    ]);

    renderMovie(movie);
    renderCrew(credits);
    renderCast(credits);
    renderTrailer(videos);
    renderScreenshots(images);
    renderSimilar(similar);
    renderProviders(providers);

  } catch (error) {
    console.error("Movie detail error:", error);
    document.getElementById("movieTitle").textContent = "Failed to load movie details";
    document.getElementById("movieOverview").textContent =
      "Something went wrong while loading this page.";
  }
}

async function tmdb(path) {
  const res = await fetch(`/api/tmdb?path=${encodeURIComponent(path)}`);
  if (!res.ok) throw new Error(`TMDB proxy error: ${res.status}`);
  return res.json();
}

function renderMovie(movie) {
  document.getElementById("movieTitle").textContent = movie.title || "Untitled";
  document.getElementById("movieTagline").textContent =
    movie.tagline || "No tagline available.";
  document.getElementById("movieOverview").textContent =
    movie.overview || "No overview available.";

  document.getElementById("moviePoster").src = movie.poster_path
    ? `${TMDB_POSTER}${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  document.getElementById("detailBackdrop").style.backgroundImage = movie.backdrop_path
    ? `url(${TMDB_IMG}${movie.backdrop_path})`
    : "linear-gradient(135deg,#111827,#0f172a)";

  document.getElementById("movieRating").textContent =
    movie.vote_average ? movie.vote_average.toFixed(1) : "0.0";

  document.getElementById("movieVotes").textContent =
    movie.vote_count ? movie.vote_count.toLocaleString() : "0";

  document.getElementById("movieReleaseYear").textContent =
    movie.release_date ? movie.release_date.slice(0, 4) : "----";

  document.getElementById("movieRuntime").textContent =
    movie.runtime ? `${movie.runtime} min` : "-- min";

  document.getElementById("movieCertification").textContent = "UA";

  const genresWrap = document.getElementById("movieGenres");
  genresWrap.innerHTML = "";
  (movie.genres || []).forEach(genre => {
    const chip = document.createElement("span");
    chip.className = "genre-chip";
    chip.textContent = genre.name;
    genresWrap.appendChild(chip);
  });

  // Placeholder until awards source is connected
  document.getElementById("oscarWins").textContent = "—";
  document.getElementById("oscarNominations").textContent = "—";

  document.getElementById("movieBudget").textContent =
    movie.budget && movie.budget > 0 ? formatMoney(movie.budget) : "—";

  document.getElementById("movieRevenue").textContent =
    movie.revenue && movie.revenue > 0 ? formatMoney(movie.revenue) : "—";
}

function renderCrew(credits) {
  const crewContainer = document.getElementById("importantCrew");
  crewContainer.innerHTML = "";

  const crew = credits.crew || [];

  const wanted = [
    { job: "Director", label: "Director" },
    { job: "Writer", label: "Writer" },
    { job: "Screenplay", label: "Screenplay" },
    { job: "Original Music Composer", label: "Music" },
    { job: "Director of Photography", label: "Cinematography" },
    { job: "Producer", label: "Producer" }
  ];

  const usedIds = new Set();
  const finalCrew = [];

  wanted.forEach(item => {
    const found = crew.find(c => c.job === item.job && !usedIds.has(c.id));
    if (found) {
      usedIds.add(found.id);
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
      title="Movie Trailer"
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
  const container = document.getElementById("similarMovies");
  container.innerHTML = "";

  const movies = (similarData.results || []).slice(0, 8);

  if (!movies.length) {
    container.innerHTML = `<div class="empty-state">Similar movies not available.</div>`;
    return;
  }

  movies.forEach(movie => {
    const poster = movie.poster_path
      ? `${TMDB_POSTER}${movie.poster_path}`
      : "https://via.placeholder.com/400x600?text=No+Poster";

    const card = document.createElement("div");
    card.className = "similar-card";
    card.innerHTML = `
      <img src="${poster}" alt="${movie.title}">
      <div class="similar-info">
        <div class="similar-title">${movie.title}</div>
        <div class="similar-meta">${movie.release_date ? movie.release_date.slice(0,4) : "----"} • ⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : "0.0"}</div>
      </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `movie-detail.html?id=${movie.id}`;
    });

    container.appendChild(card);
  });
}

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

function openWatchPage() {
  window.location.href = `watch.html?type=movie&id=${movieId}`;
}

function formatMoney(amount) {
  return "$" + amount.toLocaleString();
}