
/* =========================
   API KEYS
========================= */

const TMDB_API_KEY = "6a782c30983b74d5e01dbab7cf128327";
const RAWG_API_KEY = "46c8367e234446499ca5c4af86087b29";

/* =========================
   SIDEBAR
========================= */

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

menuBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
});

overlay.addEventListener("click", () => {
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

/* =========================
   DATA STORAGE
========================= */

let heroItems = [];
let currentSlide = 0;

/* =========================
   LOAD HERO CONTENT
========================= */

async function loadHeroContent() {

    try {

        const movieRes =
        await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`
        );

        const movieData =
        await movieRes.json();

        const tvRes =
        await fetch(
        `https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}`
        );

        const tvData =
        await tvRes.json();

        const movies =
        movieData.results.slice(0,3);

        const series =
        tvData.results.slice(0,3);

        movies.forEach(item=>{
            item.contentType="🎬 Movie";
        });

        series.forEach(item=>{
            item.contentType="📺 Web Series";
        });

        heroItems=[
            ...movies,
            ...series
        ];

        updateHero();

        setInterval(()=>{
            nextSlide();
        },5000);

    }

    catch(error){

        console.error(error);

    }

}

/* =========================
   UPDATE HERO
========================= */

function updateHero(){

    const item =
    heroItems[currentSlide];

    if(!item) return;

    heroTitle.textContent =
    item.title || item.name;

    heroDescription.textContent =
    item.overview;

    heroType.textContent =
    item.contentType;

    heroRating.textContent =
    `⭐ ${item.vote_average.toFixed(1)}`;

    heroSlider.style.backgroundImage =
    `
    linear-gradient(
    90deg,
    rgba(0,0,0,.92),
    rgba(0,0,0,.25)
    ),
    url(
    https://image.tmdb.org/t/p/original${item.backdrop_path}
    )
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

if(currentSlide<0){

currentSlide=
heroItems.length-1;

}

updateHero();

}
);

/* =========================
   CARD CREATOR
========================= */

function createCard(item){

    return `
    <div class="card">

        <img
        src="https://image.tmdb.org/t/p/w500${item.poster_path}"
        >

        <div class="card-info">

            <h3>
            ${item.title || item.name}
            </h3>

            <p>
            ⭐ ${item.vote_average.toFixed(1)}
            </p>

        </div>

    </div>
    `;

}

/* =========================
   MOVIES
========================= */

async function loadMovies(){

    const res =
    await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`
    );

    const data =
    await res.json();

    const row =
    document.getElementById(
    "moviesRow"
    );

    row.innerHTML =
    data.results
    .slice(0,10)
    .map(createCard)
    .join("");

}

/* =========================
   WEB SERIES
========================= */

async function loadSeries(){

    const res =
    await fetch(
    `https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}`
    );

    const data =
    await res.json();

    const row =
    document.getElementById(
    "seriesRow"
    );

    row.innerHTML =
    data.results
    .slice(0,10)
    .map(createCard)
    .join("");

}

/* =========================
   ANIME
========================= */

async function loadAnime(){

    try{

    const res =
    await fetch(
    "https://api.jikan.moe/v4/top/anime"
    );

    const data =
    await res.json();

    const row =
    document.getElementById(
    "animeRow"
    );

    row.innerHTML =
    data.data
    .slice(0,10)
    .map(anime=>`

    <div class="card">

        <img src="${anime.images.jpg.image_url}">

        <div class="card-info">

            <h3>
            ${anime.title}
            </h3>

            <p>
            ⭐ ${anime.score}
            </p>

        </div>

    </div>

    `)
    .join("");

    }

    catch(err){

    console.log(err);

    }

}

/* =========================
   GAMES
========================= */

async function loadGames(){

    try{

    const res =
    await fetch(
    `https://api.rawg.io/api/games?key=${RAWG_API_KEY}`
    );

    const data =
    await res.json();

    const row =
    document.getElementById(
    "gamesRow"
    );

    row.innerHTML =
    data.results
    .slice(0,10)
    .map(game=>`

    <div class="card">

        <img src="${game.background_image}">

        <div class="card-info">

            <h3>
            ${game.name}
            </h3>

            <p>
            ⭐ ${game.rating}
            </p>

        </div>

    </div>

    `)
    .join("");

    }

    catch(err){

    console.log(err);

    }

}

/* =========================
   CARTOONS
========================= */

async function loadCartoons(){

    const row =
    document.getElementById(
    "cartoonRow"
    );

    row.innerHTML = `
    <div class="card">
        <div class="card-info">
        <h3>Coming Soon</h3>
        <p>Cartoon API Setup Next</p>
        </div>
    </div>
    `;

}

/* =========================
   START
========================= */

loadHeroContent();
loadMovies();
loadSeries();
loadAnime();
loadGames();
loadCartoons();
loadActors();

/* =========================
   GLOBAL SUPERSTARS
========================= */

async function loadActors(){

const actorsRow =
document.getElementById("actorsRow");

actorsRow.innerHTML = "";

/* FIXED INDIAN ACTORS */

const indianActors = [

{
name:"Prabhas",
country:"🇮🇳 India",
known:"Baahubali, Salaar, Kalki 2898 AD",
photo:"https://image.tmdb.org/t/p/w500/qJxzjUjCpTPvDHldNnlbRC4OqEh.jpg"
},

{
name:"Shah Rukh Khan",
country:"🇮🇳 India",
known:"Pathaan, Jawan, Don",
photo:"https://image.tmdb.org/t/p/w500/tbIWQKjJ6LhQ7rJ8jYVQF6n5m5H.jpg"
},

{
name:"Allu Arjun",
country:"🇮🇳 India",
known:"Pushpa, Ala Vaikunthapurramuloo",
photo:"https://image.tmdb.org/t/p/w500/yL8x9KzP6mF5lWzB9YxV5gW2xQ4.jpg"
}

];

/* ADD FIXED INDIANS */

indianActors.forEach(actor=>{

actorsRow.innerHTML += `

<div class="card">

<img src="${actor.photo}">

<div class="card-info">

<h3>${actor.name}</h3>

<p>${actor.country}</p>

<p><strong>Known For:</strong></p>

<p>${actor.known}</p>

</div>

</div>

`;

});

/* TMDB CELEBRITIES */

try{

const res = await fetch(
`https://api.themoviedb.org/3/person/popular?api_key=${TMDB_API_KEY}`
);

const data = await res.json();

data.results.slice(0,17).forEach(person=>{

actorsRow.innerHTML += `

<div class="card">

<img
src="https://image.tmdb.org/t/p/w500${person.profile_path}"
alt="${person.name}"
>

<div class="card-info">

<h3>${person.name}</h3>

<p>🌍 Global Celebrity</p>

<p><strong>Popularity:</strong></p>

<p>${Math.round(person.popularity)}</p>

</div>

</div>

`;

});

}

catch(err){

console.log(err);

}

}