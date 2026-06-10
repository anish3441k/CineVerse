```javascript
const RAWG_API_KEY = "46c8367e234446499ca5c4af86087b29";

/* =========================
SIDEBAR
========================= */

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

if(menuBtn){
menuBtn.addEventListener("click",()=>{
sidebar.classList.add("active");
overlay.classList.add("active");
});
}

if(overlay){
overlay.addEventListener("click",()=>{
sidebar.classList.remove("active");
overlay.classList.remove("active");
});
}

/* =========================
HERO
========================= */

const heroSlider =
document.getElementById("heroSlider");

const heroTitle =
document.getElementById("heroTitle");

const heroDescription =
document.getElementById("heroDescription");

const heroType =
document.getElementById("heroType");

const heroRating =
document.getElementById("heroRating");

let heroGames = [];
let currentSlide = 0;

/* =========================
CARD
========================= */

function createGameCard(game){

return `
<div class="card">

<img
src="${game.background_image}"
alt="${game.name}"
>

<div class="card-info">

<h3>${game.name}</h3>

<p>⭐ ${game.rating}</p>

<p>📅 ${game.released || "TBA"}</p>

</div>

</div>

`;

}

/* =========================
LOAD CATEGORY
========================= */

async function loadCategory(url,rowId){

try{

const res = await fetch(url);
const data = await res.json();

const row =
document.getElementById(rowId);

if(!row) return;

row.innerHTML =
data.results
.slice(0,20)
.map(createGameCard)
.join("");

}catch(err){

console.log(err);

}

}

/* =========================
HERO
========================= */

async function loadHeroGames(){

const res =
await fetch(
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-added&page_size=10`
);

const data =
await res.json();

heroGames =
data.results;

updateHero();

setInterval(
nextSlide,
5000
);

}

function updateHero(){

const game =
heroGames[currentSlide];

if(!game) return;

heroTitle.textContent =
game.name;

heroDescription.textContent =
`Released: ${game.released || "TBA"}`;

heroType.textContent =
"🎮 Game";

heroRating.textContent =
`⭐ ${game.rating}`;

heroSlider.style.backgroundImage =
`
linear-gradient(
90deg,
rgba(0,0,0,.95),
rgba(0,0,0,.35)
),
url(${game.background_image})
`;

}

function nextSlide(){

currentSlide++;

if(currentSlide >= heroGames.length){

currentSlide = 0;

}

updateHero();

}

document
.querySelector(".next-btn")
?.addEventListener(
"click",
nextSlide
);

document
.querySelector(".prev-btn")
?.addEventListener(
"click",
()=>{

currentSlide--;

if(currentSlide < 0){

currentSlide =
heroGames.length - 1;

}

updateHero();

}
);

/* =========================
LOAD HERO
========================= */

loadHeroGames();

/* =========================
TRENDING
========================= */

loadCategory(
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-added`,
"trendingRow"
);

/* =========================
TOP RATED
========================= */

loadCategory(
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-rating`,
"topRatedRow"
);

/* =========================
ACTION
========================= */

loadCategory(
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=action`,
"actionRow"
);

/* =========================
OPEN WORLD
========================= */

loadCategory(
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&tags=open-world`,
"openWorldRow"
);

/* =========================
RPG
========================= */

loadCategory(
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=role-playing-games-rpg`,
"rpgRow"
);

/* =========================
SHOOTER
========================= */

loadCategory(
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=shooter`,
"shooterRow"
);

/* =========================
HORROR
========================= */

loadCategory(
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&tags=horror`,
"horrorRow"
);

/* =========================
RACING
========================= */

loadCategory(
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=racing`,
"racingRow"
);

/* =========================
SPORTS
========================= */

loadCategory(
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=sports`,
"sportsRow"
);

/* =========================
UPCOMING
========================= */

loadCategory(
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&dates=2026-01-01,2027-12-31&ordering=released`,
"upcomingRow"
);
```
