/* =========================
   API
========================= */

const TMDB_API_KEY = "6a782c30983b74d5e01dbab7cf128327";

function tmdbUrl(path, params = {}) {
    const query = new URLSearchParams(params).toString();
    return `/api/tmdb?path=${encodeURIComponent(path)}${query ? `&${query}` : ""}`;
}


/* =========================
   SIDEBAR
========================= */

const menuBtn =
document.getElementById("menuBtn");

const sidebar =
document.getElementById("sidebar");

const overlay =
document.getElementById("overlay");

menuBtn.addEventListener("click",()=>{

sidebar.classList.add("active");
overlay.classList.add("active");

});

overlay.addEventListener("click",()=>{

sidebar.classList.remove("active");
overlay.classList.remove("active");

});

/* =========================
   HERO ELEMENTS
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

let heroItems = [];
let currentSlide = 0;

/* =========================
   HERO SLIDER
========================= */

async function loadHeroContent(){

try{

const res =
await fetch(
`${tmdbUrl("/trending/tv/week")}`
);

const data =
await res.json();

heroItems =
data.results.filter(
item => item.backdrop_path
).slice(0,6);

updateHero();

setInterval(()=>{

nextSlide();

},5000);

}

catch(err){

console.log(err);

}

}

function updateHero(){

const item =
heroItems[currentSlide];

if(!item) return;

heroTitle.textContent =
item.name;

heroDescription.textContent =
(item.overview || "")
.substring(0,180) + "...";

heroType.textContent =
"📺 Series";

heroRating.textContent =
`⭐ ${item.vote_average}`;

if(item.backdrop_path){

heroSlider.style.backgroundImage =
`
linear-gradient(
90deg,
rgba(0,0,0,.95),
rgba(0,0,0,.35)
),
url(https://image.tmdb.org/t/p/original${item.backdrop_path})
`;


}

}

function nextSlide(){

currentSlide++;

if(currentSlide >= heroItems.length){

currentSlide = 0;

}

updateHero();

}

const nextBtn =
document.querySelector(".next-btn");

const prevBtn =
document.querySelector(".prev-btn");

if(nextBtn){

nextBtn.addEventListener(
"click",
nextSlide
);

}

if(prevBtn){

prevBtn.addEventListener(
"click",
()=>{

currentSlide--;

if(currentSlide < 0){

currentSlide =
heroItems.length - 1;

}

updateHero();

}
);

}

/* =========================
   CARD
========================= */

function createSeriesCard(series){

return `

<div
class="card"
onclick="openSeries(${series.id})"
>

<img
src="https://image.tmdb.org/t/p/w500${series.poster_path}"
alt="${series.name}"
>

<div class="card-info">

<h3>${series.name}</h3>

<p>

${series.vote_average ? `⭐ ${series.vote_average}` : ""}

</p>

</div>

</div>

`;

}

function createUpcomingSeriesCard(series){

return `

<div class="card">

<img
src="https://image.tmdb.org/t/p/w500${series.poster_path}"
alt="${series.name}"
>

<div class="card-info">

<h3>${series.name}</h3>

<p>📅 ${series.first_air_date || "Coming Soon"}</p>

</div>

</div>

`;

}

/* =========================
   CATEGORY LOADER
========================= */

async function loadCategory(
url,
rowId
){

try{

const res =
await fetch(url);

const data =
await res.json();

const row =
document.getElementById(rowId);

if(!row){
console.log("Missing Row:", rowId);
return;
}

row.innerHTML =
data.results
.slice(0,20)
.map(createSeriesCard)
.join("");

}

catch(err){

console.log(err);

}

}

/* =========================
   LOAD SECTIONS
========================= */

loadHeroContent();

/* Trending */

loadCategory(
`${tmdbUrl("/trending/tv/week")}`,
"trendingRow"
);

/* Drama */

loadCategory(
`${tmdbUrl("/discover/tv?with_genres=18")}`,
"dramaRow"
);

/* Crime */

loadCategory(
`${tmdbUrl("/discover/tv?with_genres=80")}`,
"crimeRow"
);

/* Sci-Fi */

loadCategory(
`${tmdbUrl("/discover/tv?with_genres=10765")}`,
"scifiRow"
);

/* Comedy */

loadCategory(
`${tmdbUrl("/discover/tv?with_genres=35")}`,
"comedyRow"
);

/* Horror */

loadCategory(
`${tmdbUrl("/discover/tv?with_genres=9648,10765")}`,
"horrorRow"
);

/* Romance */

loadCategory(
`${tmdbUrl("/discover/tv?with_genres=10749")}`,
"romanceRow"
);

/* Korean Dramas */

loadCategory(
`${tmdbUrl("/discover/tv?with_origin_country=KR")}`,
"kdramaRow"
);

/* Indian Series */

loadCategory(
`${tmdbUrl("/discover/tv?with_origin_country=IN")}`,
"indianRow"
);

/* Top Rated */

loadCategory(
`${tmdbUrl("/tv/top_rated")}`,
"topRatedRow"
);

/* Upcoming / Airing Today */

async function loadUpcomingSeries(){

try{

const res =
await fetch(
`${tmdbUrl("/tv/on_the_air")}`
);

const data =
await res.json();

console.log(data);

const row =
document.getElementById("upcomingRow");

row.innerHTML =
data.results
.slice(0,20)
.map(createSeriesCard)
.join("");

}

catch(err){

console.log(err);

}

}

loadUpcomingSeries();

/* =========================
   OPEN SERIES DETAIL
========================= */

function openSeries(id){

window.location.href =
`series-detail.html?id=${id}`;

}