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

const heroTitle =
document.getElementById("heroTitle");

const heroDescription =
document.getElementById("heroDescription");

const heroType =
document.getElementById("heroType");

const heroRating =
document.getElementById("heroRating");

const heroSlider =
document.querySelector(".hero-slider");

/* =========================
   DATA
========================= */

let heroItems = [];
let currentSlide = 0;

/* =========================
   LOAD HERO CONTENT
========================= */

async function loadHeroContent() {

    try {

        const movieResponse = await fetch(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`
        );

        const movieData =
            await movieResponse.json();

        const tvResponse = await fetch(
            `https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}`
        );

        const tvData =
            await tvResponse.json();

        const movies =
            movieData.results.slice(0, 5);

        const series =
            tvData.results.slice(0, 5);

        movies.forEach(item => {
            item.contentType = "🎬 Movie";
        });

        series.forEach(item => {
            item.contentType = "📺 Web Series";
        });

        heroItems = [
            ...movies,
            ...series
        ];

        updateHero();

        startSlider();

    } catch (error) {

        console.error(
            "Hero Error:",
            error
        );

    }

}

/* =========================
   UPDATE HERO
========================= */

function updateHero() {

    if (!heroItems.length) return;

    const item =
        heroItems[currentSlide];

    heroTitle.textContent =
        item.title || item.name;

    heroDescription.textContent =
        item.overview ||
        "No description available.";

    heroType.textContent =
        item.contentType;

    heroRating.textContent =
        item.vote_average
        ? `⭐ ${item.vote_average.toFixed(1)}`
        : "⭐ N/A";

    if(item.backdrop_path){

        heroSlider.style.background = `
        linear-gradient(
        90deg,
        rgba(0,0,0,.88),
        rgba(0,0,0,.45)
        ),
        url(
        https://image.tmdb.org/t/p/original${item.backdrop_path}
        )
        `;

        heroSlider.style.backgroundSize =
        "cover";

        heroSlider.style.backgroundPosition =
        "center";
    }

}

/* =========================
   SLIDER
========================= */

function nextSlide() {

    currentSlide++;

    if(currentSlide >= heroItems.length){

        currentSlide = 0;

    }

    updateHero();

}

function prevSlide() {

    currentSlide--;

    if(currentSlide < 0){

        currentSlide =
        heroItems.length - 1;

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
prevSlide
);

function startSlider(){

    setInterval(() => {

        nextSlide();

    },5000);

}

/* =========================
   TRENDING ACTORS
========================= */

async function loadActors(){

    try{

        const response = await fetch(
        `https://api.themoviedb.org/3/trending/person/week?api_key=${TMDB_API_KEY}`
        );

        const data =
        await response.json();

        const actorsRow =
        document.getElementById(
        "actorsRow"
        );

        actorsRow.innerHTML = "";

        data.results
        .slice(0,12)
        .forEach(person=>{

            const image =
            person.profile_path
            ?
            `https://image.tmdb.org/t/p/w500${person.profile_path}`
            :
            "https://via.placeholder.com/500x750";

            actorsRow.innerHTML += `

            <div class="person-card">

                <img src="${image}">

                <div class="person-info">

                    <h3>
                    ${person.name}
                    </h3>

                    <p>
                    Popularity:
                    ${Math.round(person.popularity)}
                    </p>

                </div>

            </div>

            `;

        });

    }catch(error){

        console.error(
        "Actors Error:",
        error
        );

    }

}

/* =========================
   SAMPLE DIRECTORS
========================= */

const directors = [

{
name:"Christopher Nolan",
known:"Interstellar",
image:"https://picsum.photos/300/400?11"
},

{
name:"James Cameron",
known:"Avatar",
image:"https://picsum.photos/300/400?12"
},

{
name:"Steven Spielberg",
known:"Jurassic Park",
image:"https://picsum.photos/300/400?13"
},

{
name:"Quentin Tarantino",
known:"Pulp Fiction",
image:"https://picsum.photos/300/400?14"
}

];

/* =========================
   SAMPLE MUSICIANS
========================= */

const musicians = [

{
name:"Hans Zimmer",
known:"Film Composer",
image:"https://picsum.photos/300/400?21"
},

{
name:"A.R. Rahman",
known:"Oscar Winner",
image:"https://picsum.photos/300/400?22"
},

{
name:"Alan Walker",
known:"Faded",
image:"https://picsum.photos/300/400?23"
},

{
name:"Ludwig Göransson",
known:"Oppenheimer",
image:"https://picsum.photos/300/400?24"
}

];

/* =========================
   CARDS
========================= */

function createCards(
data,
target
){

const row =
document.getElementById(
target
);

data.forEach(item=>{

row.innerHTML += `

<div class="person-card">

<img src="${item.image}">

<div class="person-info">

<h3>${item.name}</h3>

<p>${item.known}</p>

</div>

</div>

`;

});

}

createCards(
directors,
"directorsRow"
);

createCards(
musicians,
"musiciansRow"
);

/* =========================
   START
========================= */

loadHeroContent();
loadActors();