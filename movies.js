/* =========================
   API
========================= */

const TMDB_API_KEY = "6a782c30983b74d5e01dbab7cf128327";

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
`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`
);

const data =
await res.json();

heroItems =
data.results.slice(0,6);

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
item.title;

heroDescription.textContent =
item.overview;

heroType.textContent =
"🎬 Movie";

heroRating.textContent =
`⭐ ${item.vote_average}`;

heroSlider.style.backgroundImage =
`
linear-gradient(
90deg,
rgba(0,0,0,.95),
rgba(0,0,0,.35)
),
url(
https://image.tmdb.org/t/p/original${item.backdrop_path}
)
`;

}

function nextSlide(){

currentSlide++;

if(currentSlide>=heroItems.length){

currentSlide=0;

}

updateHero();

}

document
.querySelector(".next-btn")
.addEventListener(
"click",
nextSlide
);

document
.querySelector(".prev-btn")
.addEventListener(
"click",
()=>{

currentSlide--;

if(currentSlide<0){

currentSlide=
heroItems.length-1;

}

updateHero();

}
);

/* =========================
   CARD
========================= */

function createMovieCard(movie){

return `

<div class="card">

<img
src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
alt="${movie.title}"
>

<div class="card-info">

<h3>${movie.title}</h3>

<p>⭐ ${movie.vote_average}</p>

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

row.innerHTML =
data.results
.slice(0,20)
.map(createMovieCard)
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

loadCategory(
`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`,
"trendingRow"
);

loadCategory(
`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28`,
"actionRow"
);

loadCategory(
`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=12`,
"adventureRow"
);

loadCategory(
`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=878`,
"scifiRow"
);

loadCategory(
`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27`,
"horrorRow"
);

loadCategory(
`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=14`,
"fantasyRow"
);

loadCategory(
`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35`,
"comedyRow"
);

loadCategory(
`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=53`,
"thrillerRow"
);

loadCategory(
`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749`,
"romanceRow"
);

loadCategory(
`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}`,
"hollywoodRow"
);

loadCategory(
`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=hi`,
"indianRow"
);

loadCategory(
`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}`,
"worldRow"
);

loadCategory(
`https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}`,
"upcomingRow"
);