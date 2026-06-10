const ANILIST_API = "https://graphql.anilist.co";

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

const heroRating =
document.getElementById("heroRating");

const heroStatus =
document.getElementById("heroStatus");

let heroAnime = [];
let currentSlide = 0;

/* =========================
ANILIST QUERY
========================= */

const trendingQuery = `
query {

Page(page:1, perPage:20){

media(
type:ANIME,
sort:TRENDING_DESC
){

title{
romaji
}

description(asHtml:false)

bannerImage

coverImage{
large
}

averageScore

status

}

}

}
`;

/* =========================
FETCH
========================= */

async function fetchTrendingAnime(){

const response =
await fetch(
ANILIST_API,
{
method:"POST",

headers:{
"Content-Type":"application/json",
"Accept":"application/json"
},

body:JSON.stringify({
query:trendingQuery
})

}
);

const data =
await response.json();

heroAnime =
data.data.Page.media;

updateHero();

loadTrendingRow();

setInterval(
nextSlide,
5000
);

}

/* =========================
HERO UPDATE
========================= */

function updateHero(){

const anime =
heroAnime[currentSlide];

if(!anime) return;

heroTitle.textContent =
anime.title.romaji;

heroDescription.textContent =
(anime.description || "")
.substring(0,200);

heroRating.textContent =
`⭐ ${anime.averageScore || "N/A"}`;

heroStatus.textContent =
anime.status === "FINISHED"
? "✅ Completed"
: "🔄 Ongoing";

heroSlider.style.backgroundImage =
`linear-gradient(
90deg,
rgba(0,0,0,.95),
rgba(0,0,0,.35)
),
url(${anime.bannerImage})`;

}

/* =========================
SLIDER
========================= */

function nextSlide(){

currentSlide++;

if(currentSlide >= heroAnime.length){

currentSlide = 0;

}

updateHero();

}

/* =========================
TRENDING ROW
========================= */

function loadTrendingRow(){

const row =
document.getElementById(
"trendingRow"
);

row.innerHTML = "";

heroAnime.forEach(anime=>{

row.innerHTML += `

<div class="card">

<img src="${anime.coverImage.large}">

<div class="card-info">

<h3>${anime.title.romaji}</h3>

<p>⭐ ${anime.averageScore || "N/A"}</p>

<p>
${anime.status === "FINISHED"
? "✅ Completed"
: "🔄 Ongoing"}
</p>

</div>

</div>

`;

});

}

fetchTrendingAnime();

/* =========================
CATEGORY LOADER
========================= */

async function loadCategory(
genre,
rowId
){

const query = `
query {

Page(page:1, perPage:20){

media(
type:ANIME,
genre:"${genre}",
sort:POPULARITY_DESC
){

title{
romaji
}

coverImage{
large
}

averageScore

status

}

}

}
`;

const response =
await fetch(
ANILIST_API,
{
method:"POST",

headers:{
"Content-Type":"application/json",
"Accept":"application/json"
},

body:JSON.stringify({
query
})

}
);

const data =
await response.json();

const row =
document.getElementById(rowId);

if(!row) return;

row.innerHTML =
data.data.Page.media.map(anime=>`

<div class="card">

<img src="${anime.coverImage.large}">

<div class="card-info">

<h3>${anime.title.romaji}</h3>

<p>⭐ ${anime.averageScore || "N/A"}</p>

<p>
${anime.status === "FINISHED"
? "✅ Completed"
: "🔄 Ongoing"}
</p>

</div>

</div>

`).join("");

}

/* =========================
LOAD CATEGORIES
========================= */

loadCategory(
"Action",
"actionRow"
);

loadCategory(
"Fantasy",
"fantasyRow"
);

loadCategory(
"Romance",
"romanceRow"
);

loadCategory(
"Comedy",
"comedyRow"
);

loadCategory(
"Horror",
"horrorRow"
);

loadCategory(
"Sci-Fi",
"scifiRow"
);

loadCategory(
"School",
"schoolRow"
);

loadCategory(
"Slice of Life",
"sliceRow"
);

async function loadAnimeMovies(){

const query = `
query {

Page(page:1, perPage:20){

media(
type:ANIME,
format:MOVIE,
sort:POPULARITY_DESC
){

title{
romaji
}

coverImage{
large
}

averageScore

status

}

}

}
`;

const response =
await fetch(
ANILIST_API,
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
query
})

}
);

const data =
await response.json();

const row =
document.getElementById("movieRow");

if(!row) return;

row.innerHTML =
data.data.Page.media.map(anime=>`

<div class="card">

<img src="${anime.coverImage.large}">

<div class="card-info">

<h3>${anime.title.romaji}</h3>

<p>⭐ ${anime.averageScore || "N/A"}</p>

<p>🎬 Movie</p>

</div>

</div>

`).join("");

}

loadAnimeMovies();