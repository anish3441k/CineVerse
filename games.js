const RAWG_API_KEY = "46c8367e234446499ca5c4af86087b29";

/* =========================
   SIDEBAR LOGIC
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
   HERO SLIDER LOGIC
   ========================= */
const heroSlider = document.getElementById("heroSlider");
const heroTitle = document.getElementById("heroTitle");
const heroDescription = document.getElementById("heroDescription");
const heroType = document.getElementById("heroType");
const heroRating = document.getElementById("heroRating");

let heroGames = [];
let currentSlide = 0;
let autoScrollTimer;

async function loadHeroGames() {
    try {
        const res = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-added&page_size=10`);
        const data = await res.json();
        if (data.results) {
            heroGames = data.results;
            updateHero();
            startAutoScroll();
        }
    } catch (err) {
        console.error("Failed to load hero games:", err);
    }
}

function updateHero() {
    const game = heroGames[currentSlide];
    if (!game || !heroSlider) return;

    if (heroTitle) heroTitle.textContent = game.name;
    if (heroDescription) heroDescription.textContent = `Released: ${game.released || "TBA"}`;
    if (heroType) heroType.textContent = "🎮 Game";
    if (heroRating) heroRating.textContent = `⭐ ${game.rating}`;

    heroSlider.style.backgroundImage = `
        linear-gradient(90deg, rgba(0,0,0,.95), rgba(0,0,0,.35)),
        url(${game.background_image})
    `;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % heroGames.length;
    updateHero();
    resetTimer(); // Restart timer so it doesn't jump immediately after click
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + heroGames.length) % heroGames.length;
    updateHero();
    resetTimer();
}

function startAutoScroll() {
    autoScrollTimer = setInterval(nextSlide, 5000);
}

function resetTimer() {
    clearInterval(autoScrollTimer);
    startAutoScroll();
}

// Event Listeners for Slider Buttons
document.querySelector(".next-btn")?.addEventListener("click", nextSlide);
document.querySelector(".prev-btn")?.addEventListener("click", prevSlide);

/* =========================
   CATEGORY LOADER
   ========================= */
function createGameCard(game) {
    return `
        <div class="card">
            <img src="${game.background_image || 'https://via.placeholder.com/400x200?text=No+Image'}" alt="${game.name}">
            <div class="card-info">
                <h3>${game.name}</h3>
                <p>⭐ ${game.rating || "N/A"}</p>
                <p>📅 ${game.released || "TBA"}</p>
            </div>
        </div>
    `;
}

async function loadCategory(url, rowId) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const row = document.getElementById(rowId);

        if (row && data.results) {
            row.innerHTML = data.results
                .slice(0, 20)
                .map(createGameCard)
                .join("");
        }
    } catch (err) {
        console.error(`Error loading category ${rowId}:`, err);
    }
}

/* =========================
   INITIALIZE APP
   ========================= */

// Hero
loadHeroGames();

// Standard Categories
loadCategory(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-added`, "trendingRow");
loadCategory(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-rating`, "topRatedRow");
loadCategory(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=action`, "actionRow");
loadCategory(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&tags=open-world`, "openWorldRow");
loadCategory(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=role-playing-games-rpg`, "rpgRow");
loadCategory(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=shooter`, "shooterRow");
loadCategory(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&tags=horror`, "horrorRow");
loadCategory(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=racing`, "racingRow");
loadCategory(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=sports`, "sportsRow");

// Upcoming (Dynamic Date Logic)
const today = new Date().toISOString().split('T')[0];
const nextYear = new Date();
nextYear.setFullYear(nextYear.getFullYear() + 1);
const yearFromNow = nextYear.toISOString().split('T')[0];

loadCategory(
    `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&dates=${today},${yearFromNow}&ordering=released`,
    "upcomingRow"
);
