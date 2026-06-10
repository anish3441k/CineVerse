```javascript
const RAWG_API_KEY = "46c8367e234446499ca5c4af86087b29";

/* =========================
SIDEBAR
========================= */

const menuBtn =
document.getElementById("menuBtn");

const sidebar =
document.getElementById("sidebar");

const overlay =
document.getElementById("overlay");

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
GET URL PARAMS
========================= */

const params =
new URLSearchParams(
window.location.search
);

const type =
params.get("type");

const category =
params.get("category");

const pageTitle =
document.getElementById("pageTitle");

const resultsGrid =
document.getElementById("resultsGrid");

/* =========================
CARD
========================= */

function createGameCard(game) {

return `
<div class="card">
    <img
        src="${game.background_image || ''}"
        alt="${game.name}"
    >

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

async function loadGames(){

let url = "";

switch(category){

case "trending":

pageTitle.textContent =
"🔥 Trending Games";

url =
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-added&page_size=40`;

break;

case "toprated":

pageTitle.textContent =
"⭐ Top Rated Games";

url =
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-rating&page_size=40`;

break;

case "action":

pageTitle.textContent =
"🎮 Action Games";

url =
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=action&page_size=40`;

break;

case "openworld":

pageTitle.textContent =
"🗺 Open World Games";

url =
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&tags=open-world&page_size=40`;

break;

case "rpg":

pageTitle.textContent =
"⚔ RPG Games";

url =
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=role-playing-games-rpg&page_size=40`;

break;

case "shooter":

pageTitle.textContent =
"🔫 Shooter Games";

url =
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=shooter&page_size=40`;

break;

case "horror":

pageTitle.textContent =
"👻 Horror Games";

url =
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&tags=horror&page_size=40`;

break;

case "racing":

pageTitle.textContent =
"🏎 Racing Games";

url =
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=racing&page_size=40`;

break;

case "sports":

pageTitle.textContent =
"⚽ Sports Games";

url =
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=sports&page_size=40`;

break;

case "upcoming":

pageTitle.textContent =
"📅 Upcoming Games";

const today =
new Date()
.toISOString()
.split("T")[0];

const nextYear =
new Date();

nextYear.setFullYear(
nextYear.getFullYear()+1
);

const yearFromNow =
nextYear
.toISOString()
.split("T")[0];

url =
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&dates=${today},${yearFromNow}&page_size=40`;

break;

default:

pageTitle.textContent =
"🎮 Games";

url =
`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page_size=40`;

}

try{

const res =
await fetch(url);

const data =
await res.json();

resultsGrid.innerHTML =
data.results
.map(createGameCard)
.join("");

}catch(err){

console.log(err);

}

}

/* =========================
INIT
========================= */

if(type === "games"){

loadGames();

}
```
