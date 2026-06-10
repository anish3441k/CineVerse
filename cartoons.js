```javascript
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

let heroItems = [];
let currentSlide = 0;

/* =========================
   HERO FETCH
========================= */

async function loadHeroContent(){

try{

const res =
await fetch(
`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&sort_by=popularity.desc`
);

const data =
await res.json();

heroItems =
data.results
.filter(item => item.backdrop_path)
.slice(0,6);

updateHero();

setInterval(
nextSlide,
5000
);

}

catch(err){

console.log(err);

}

}

/* =========================
   HERO UPDATE
========================= */

function updateHero(){

const item =
heroItems[currentSlide];

if(!item) return;

heroTitle.textContent =
item.name;

heroDescription.textContent =
(item.overview || "")
.substring(0,180);

heroType.textContent =
"📺 Cartoon";

heroRating.textContent =
`⭐ ${item.vote_average}`;

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

/* =========================
   SLIDER
========================= */

function nextSlide(){

currentSlide++;

if(currentSlide >= heroItems.length){

currentSlide = 0;

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

if(currentSlide < 0){

currentSlide =
heroItems.length - 1;

}

updateHero();

}
);

/* =========================
   CARD
========================= */

function createCard(item){

return `

<div class="card">

<img
src="https://image.tmdb.org/t/p/w500${item.poster_path}"
alt="${item.name || item.title}"
>

<div class="card-info">

<h3>
${item.name || item.title}
</h3>

<p>
⭐ ${item.vote_average}
</p>

<p>
📺 Cartoon
</p>

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

if(!row) return;

row.innerHTML =
data.results
.slice(0,20)
.map(createCard)
.join("");

}

catch(err){

console.log(err);

}

}

/* =========================
   LOAD HERO
========================= */

loadHeroContent();

/* =========================
   TRENDING CARTOONS
========================= */

loadCategory(
`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&sort_by=popularity.desc`,
"trendingRow"
);
```
