
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

  async function loadCartoons(){

try{

const res = await fetch(
`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=16&sort_by=popularity.desc`
);

const data = await res.json();

const row =
document.getElementById("cartoonRow");

row.innerHTML = "";

data.results
.slice(0,10)
.forEach(cartoon=>{

row.innerHTML += `

<div class="card">

<img
src="https://image.tmdb.org/t/p/w500${cartoon.poster_path}"
alt="${cartoon.title}"
>

<div class="card-info">

<h3>${cartoon.title}</h3>

<p>⭐ ${cartoon.vote_average}</p>

</div>

</div>

`;

});

}

catch(err){

console.log(err);

}

}

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
loadDirectors();
loadMusicians();

/* =========================
   GLOBAL SUPERSTARS
========================= */

async function loadActors(){

const actorsRow =
document.getElementById("actorsRow");

actorsRow.innerHTML = "";

try{

const res = await fetch(
`https://api.themoviedb.org/3/person/popular?api_key=${TMDB_API_KEY}`
);

const data = await res.json();

data.results
.slice(0,20)
.forEach(person=>{

const knownFor =
person.known_for
?.map(item =>
item.title || item.name
)
.join(", ")
|| "Entertainment";

actorsRow.innerHTML += `

<div class="card">

<img
src="https://image.tmdb.org/t/p/w500${person.profile_path}"
alt="${person.name}"
>

<div class="card-info">

<h3>${person.name}</h3>

<p>🌍 Global Celebrity</p>

<p><strong>Known For:</strong></p>

<p>${knownFor}</p>

</div>

</div>

`;

});

}

catch(err){

console.log(err);

}

}

async function loadDirectors(){

const directorsRow =
document.getElementById("directorsRow");

const directors = [

{
name:"S. S. Rajamouli",
country:"🇮🇳 India",
known:"RRR, Baahubali",
photo:"https://upload.wikimedia.org/wikipedia/commons/9/9b/S._S._Rajamouli.jpg"
},
{name:"Christopher Nolan",country:"🇬🇧 United Kingdom",known:"Interstellar, Oppenheimer"},
{name:"James Cameron",country:"🇨🇦 Canada",known:"Avatar, Titanic"},
{name:"Steven Spielberg",country:"🇺🇸 USA",known:"Jurassic Park, Jaws"},
{name:"Quentin Tarantino",country:"🇺🇸 USA",known:"Pulp Fiction"},
{name:"Martin Scorsese",country:"🇺🇸 USA",known:"The Departed"},
{name:"Peter Jackson",country:"🇳🇿 New Zealand",known:"Lord of the Rings"},
{name:"Denis Villeneuve",country:"🇨🇦 Canada",known:"Dune"},
{name:"Ridley Scott",country:"🇬🇧 United Kingdom",known:"Gladiator"},
{name:"David Fincher",country:"🇺🇸 USA",known:"Fight Club"},
{name:"Guy Ritchie",country:"🇬🇧 United Kingdom",known:"Sherlock Holmes"},
{name:"George Lucas",country:"🇺🇸 USA",known:"Star Wars"},
{name:"Tim Burton",country:"🇺🇸 USA",known:"Batman"},
{name:"Francis Ford Coppola",country:"🇺🇸 USA",known:"The Godfather"},
{name:"Zack Snyder",country:"🇺🇸 USA",known:"Justice League"},
{name:"Jon Favreau",country:"🇺🇸 USA",known:"Iron Man"},
{name:"Sukumar",country:"🇮🇳 India",known:"Pushpa"},
{name:"Lokesh Kanagaraj",country:"🇮🇳 India",known:"Leo, Vikram"},
{name:"Sanjay Leela Bhansali",country:"🇮🇳 India",known:"Padmaavat"},
{name:"Mani Ratnam",country:"🇮🇳 India",known:"Ponniyin Selvan"}

];

directors.forEach(person=>{

directorsRow.innerHTML += `

<div class="card">

<img src="https://picsum.photos/400/600?random=${Math.random()}">

<div class="card-info">

<h3>${person.name}</h3>

<p>${person.country}</p>

<p><strong>Known For:</strong></p>

<p>${person.known}</p>

</div>

</div>

`;

});

}

async function loadMusicians(){

const musiciansRow =
document.getElementById("musiciansRow");

const musicians = [

{name:"A. R. Rahman",country:"🇮🇳 India",known:"Slumdog Millionaire"},
{name:"Anirudh Ravichander",country:"🇮🇳 India",known:"Leo, Jailer"},
{name:"Devi Sri Prasad",country:"🇮🇳 India",known:"Pushpa"},
{name:"S. Thaman",country:"🇮🇳 India",known:"Akhanda"},
{name:"Hans Zimmer",country:"🇩🇪 Germany",known:"Interstellar"},
{name:"John Williams",country:"🇺🇸 USA",known:"Star Wars"},
{name:"Ludwig Göransson",country:"🇸🇪 Sweden",known:"Oppenheimer"},
{name:"Alan Walker",country:"🇳🇴 Norway",known:"Faded"},
{name:"The Weeknd",country:"🇨🇦 Canada",known:"Blinding Lights"},
{name:"Taylor Swift",country:"🇺🇸 USA",known:"Cruel Summer"},
{name:"Ed Sheeran",country:"🇬🇧 United Kingdom",known:"Shape of You"},
{name:"Eminem",country:"🇺🇸 USA",known:"Lose Yourself"},
{name:"Adele",country:"🇬🇧 United Kingdom",known:"Hello"},
{name:"Bruno Mars",country:"🇺🇸 USA",known:"Uptown Funk"},
{name:"Billie Eilish",country:"🇺🇸 USA",known:"Bad Guy"},
{name:"Imagine Dragons",country:"🇺🇸 USA",known:"Believer"},
{name:"Marshmello",country:"🇺🇸 USA",known:"Alone"},
{name:"David Guetta",country:"🇫🇷 France",known:"Titanium"},
{name:"Coldplay",country:"🇬🇧 United Kingdom",known:"Yellow"},
{name:"Linkin Park",country:"🇺🇸 USA",known:"Numb"}

];

musicians.forEach(person=>{

musiciansRow.innerHTML += `

<div class="card">

<img src="https://picsum.photos/400/600?random=${Math.random()}">

<div class="card-info">

<h3>${person.name}</h3>

<p>${person.country}</p>

<p><strong>Known For:</strong></p>

<p>${person.known}</p>

</div>

</div>

`;

});

}