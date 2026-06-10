const RAWG_API_KEY = "46c8367e234446499ca5c4af86087b29";

/* =========================
   SIDEBAR
   ========================= */
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

if (menuBtn && sidebar && overlay) {
    menuBtn.addEventListener("click", () => {
        sidebar.classList.add("active");
        overlay.classList.add("active");
    });

    overlay.addEventListener("click", () => {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    });
}

/* =========================
   GET URL PARAMS
   ========================= */
const params = new URLSearchParams(window.location.search);
const type = params.get("type");
const category = params.get("category");

const pageTitle = document.getElementById("pageTitle");
const resultsGrid = document.getElementById("resultsGrid");

/* =========================
   CARD COMPONENT
   ========================= */
function createGameCard(game) {
    // Added a placeholder image fallback
    const imgUrl = game.background_image || 'https://via.placeholder.com/600x400?text=No+Image+Available';
    
    return `
    <div class="card">
        <img src="${imgUrl}" alt="${game.name}">
        <div class="card-info">
            <h3>${game.name}</h3>
            <p>⭐ ${game.rating || "N/A"}</p>
            <p>📅 ${game.released || "TBA"}</p>
        </div>
    </div>
    `;
}

/* =========================
   LOAD GAMES
   ========================= */
async function loadGames() {
    if (!resultsGrid) return; // Prevent errors if grid isn't in HTML

    // Show loading state
    resultsGrid.innerHTML = `<div class="loading">Loading games...</div>`;

    let url = "";
    let title = "🎮 Games";

    switch (category) {
        case "trending":
            title = "🔥 Trending Games";
            url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-added&page_size=40`;
            break;
        case "toprated":
            title = "⭐ Top Rated Games";
            url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-rating&page_size=40`;
            break;
        case "action":
            title = "🎮 Action Games";
            url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=action&page_size=40`;
            break;
        case "openworld":
            title = "🗺 Open World Games";
            url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&tags=open-world&page_size=40`;
            break;
        case "rpg":
            title = "⚔ RPG Games";
            url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=role-playing-games-rpg&page_size=40`;
            break;
        case "shooter":
            title = "🔫 Shooter Games";
            url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=shooter&page_size=40`;
            break;
        case "horror":
            title = "👻 Horror Games";
            url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&tags=horror&page_size=40`;
            break;
        case "racing":
            title = "🏎 Racing Games";
            url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=racing&page_size=40`;
            break;
        case "sports":
            title = "⚽ Sports Games";
            url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=sports&page_size=40`;
            break;
        case "upcoming":
            title = "📅 Upcoming Games";
            const today = new Date().toISOString().split("T")[0];
            const nextYearDate = new Date();
            nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
            const yearFromNow = nextYearDate.toISOString().split("T")[0];
            // Added ordering=released so upcoming shows closest dates first
            url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&dates=${today},${yearFromNow}&ordering=released&page_size=40`;
            break;
        default:
            title = "🎮 All Games";
            url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page_size=40`;
    }

    if (pageTitle) pageTitle.textContent = title;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch data");
        
        const data = await res.json();

        if (data.results && data.results.length > 0) {
            resultsGrid.innerHTML = data.results
                .map(createGameCard)
                .join("");
        } else {
            resultsGrid.innerHTML = `<p class="no-results">No games found for this category.</p>`;
        }
    } catch (err) {
        console.error(err);
        resultsGrid.innerHTML = `<p class="error">Error loading games. Please check your connection or API key.</p>`;
    }
}

/* =========================
   INIT
   ========================= */
// Checks if the page is intended to show games or if a category exists
if (type === "games" || category) {
    loadGames();
}