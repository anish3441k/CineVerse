/*==========================================================
    CineVerse - Anime Detail Page
    Version : 2.0
==========================================================*/

/*==========================================================
    CONFIG
==========================================================*/

const CONFIG = {

    TMDB_API_KEY: "YOUR_TMDB_API_KEY",

    TMDB_BASE: "https://api.themoviedb.org/3",

    TMDB_IMAGE: "https://image.tmdb.org/t/p/original",

    TMDB_POSTER: "https://image.tmdb.org/t/p/w500",

    JIKAN_BASE: "https://api.jikan.moe/v4"

};

/*==========================================================
    PAGE STATE
==========================================================*/

const PAGE = {

    animeId: null,

    type: "series",

    jikan: null,

    tmdb: null,

    data: null,

    reviews: [],

    theme: {}

};

/*==========================================================
    DOM
==========================================================*/

const DOM = {

    poster: document.getElementById("animePoster"),

    title: document.getElementById("animeTitle"),

    jpTitle: document.getElementById("animeJapaneseTitle"),

    englishTitle: document.getElementById("animeEnglishTitle"),

    overview: document.getElementById("animeOverview"),

    year: document.getElementById("animeYear"),

    episodes: document.getElementById("animeEpisodes"),

    rating: document.getElementById("animeRating"),

    genres: document.getElementById("genreContainer"),

    infoCards: document.getElementById("infoCards"),

    trailer: document.getElementById("trailerPlayer"),

    youtubeTrailer: document.getElementById("youtubeTrailer"),

    providers: document.getElementById("watchProviders"),

    crew: document.getElementById("crewGrid"),

    voice: document.getElementById("voiceCastGrid"),

    screenshots: document.getElementById("screenshotsGrid"),

    relatedMovies: document.getElementById("relatedMoviesGrid"),

    similarAnime: document.getElementById("similarAnimeGrid"),

    reviewContainer: document.getElementById("reviewContainer")

};

/*==========================================================
    START
==========================================================*/

window.addEventListener(

    "DOMContentLoaded",

    initializePage

);

/*==========================================================
    INITIALIZE
==========================================================*/

async function initializePage(){

    try{

        setupSidebar();

        setupSearch();

        readURL();

        showLoading();

        await loadAnime();

        hideLoading();

    }

    catch(error){

        console.error(error);

        showError();

    }

}

/*==========================================================
    URL
==========================================================*/

function readURL(){

    const params = new URLSearchParams(

        window.location.search

    );

    PAGE.animeId = params.get("id");

    PAGE.type = params.get("type") || "series";

}

/*==========================================================
    MAIN LOADER
==========================================================*/

async function loadAnime(){

    PAGE.jikan = await loadJikan();

    PAGE.tmdb = await loadTMDB();

    mergeData();

    renderPage();

}

/*==========================================================
    LOADING
==========================================================*/

function showLoading(){

    console.log("Loading Anime...");

}

function hideLoading(){

    console.log("Finished");

}

/*==========================================================
    ERROR
==========================================================*/

function showError(){

    document.body.innerHTML=

    `

    <div class="errorPage">

        <h1>

            Anime Not Found

        </h1>

        <p>

            Please try another title.

        </p>

    </div>

    `;

}

/*==========================================================
    SIDEBAR
==========================================================*/

function setupSidebar(){

    const menu = document.getElementById("menuBtn");

    const sidebar = document.getElementById("sidebar");

    const overlay = document.getElementById("sidebarOverlay");

    menu.addEventListener("click",()=>{

        sidebar.classList.add("active");

        overlay.classList.add("active");

    });

    overlay.addEventListener("click",closeSidebar);

    document.querySelectorAll(

        "#sidebar a"

    ).forEach(link=>{

        link.addEventListener(

            "click",

            closeSidebar

        );

    });

}

function closeSidebar(){

    document

    .getElementById("sidebar")

    .classList.remove("active");

    document

    .getElementById("sidebarOverlay")

    .classList.remove("active");

}

/*==========================================================
    SEARCH
==========================================================*/

function setupSearch(){

    const search =

    document.getElementById("globalSearch");

    search.addEventListener(

        "keypress",

        function(e){

            if(e.key==="Enter"){

                window.location.href=

                `search.html?q=${encodeURIComponent(this.value)}`;

            }

        }

    );

}

/*==========================================================
    HOME
==========================================================*/

function goHome(){

    window.location.href="index.html";

}

/*==========================================================
    LOAD JIKAN
==========================================================*/

async function loadJikan(){

    try{

        const response = await fetch(

            `${CONFIG.JIKAN_BASE}/anime/${PAGE.animeId}/full`

        );

        if(!response.ok){

            throw new Error("Jikan request failed.");

        }

        const json = await response.json();

        return json.data;

    }

    catch(error){

        console.error("Jikan Error :",error);

        return null;

    }

}

/*==========================================================
    LOAD TMDB
==========================================================*/

async function loadTMDB(){

    if(!PAGE.jikan){

        return null;

    }

    const titles=[];

    if(PAGE.jikan.title_english)

        titles.push(PAGE.jikan.title_english);

    if(PAGE.jikan.title)

        titles.push(PAGE.jikan.title);

    if(PAGE.jikan.title_japanese)

        titles.push(PAGE.jikan.title_japanese);

    if(PAGE.jikan.title_synonyms){

        PAGE.jikan.title_synonyms.forEach(title=>{

            titles.push(title);

        });

    }

    let result=null;

    for(const title of titles){

        result=await searchTMDB(title);

        if(result){

            break;

        }

    }

    return result;

}

/*==========================================================
    SEARCH TMDB
==========================================================*/

async function searchTMDB(title){

    try{

        /* Search TV */

        let response=await fetch(

`${CONFIG.TMDB_BASE}/search/tv?api_key=${CONFIG.TMDB_API_KEY}&query=${encodeURIComponent(title)}`

        );

        let json=await response.json();

        if(json.results.length){

            return await loadTMDBDetails(

                json.results[0].id,

                "tv"

            );

        }

        /* Search Movie */

        response=await fetch(

`${CONFIG.TMDB_BASE}/search/movie?api_key=${CONFIG.TMDB_API_KEY}&query=${encodeURIComponent(title)}`

        );

        json=await response.json();

        if(json.results.length){

            return await loadTMDBDetails(

                json.results[0].id,

                "movie"

            );

        }

        return null;

    }

    catch(error){

        console.error("TMDB Search Error :",error);

        return null;

    }

}

/*==========================================================
    TMDB DETAILS
==========================================================*/

async function loadTMDBDetails(id,type){

    try{

        const response=await fetch(

`${CONFIG.TMDB_BASE}/${type}/${id}?api_key=${CONFIG.TMDB_API_KEY}&append_to_response=videos,images,credits,watch/providers,recommendations`

        );

        const json=await response.json();

        json.mediaType=type;

        json.tmdbId=id;

        return json;

    }

    catch(error){

        console.error("TMDB Details Error :",error);

        return null;

    }

}

/*==========================================================
    MERGE DATA
==========================================================*/

function mergeData(){

    PAGE.data={

        /* ---------- Titles ---------- */

        title:

            PAGE.jikan?.title ||

            "",

        englishTitle:

            PAGE.jikan?.title_english ||

            "",

        japaneseTitle:

            PAGE.jikan?.title_japanese ||

            "",

        /* ---------- Basic ---------- */

        synopsis:

            PAGE.jikan?.synopsis ||

            "",

        year:

            PAGE.jikan?.year ||

            "-",

        score:

            PAGE.jikan?.score ||

            "-",

        episodes:

            PAGE.jikan?.episodes ||

            "-",

        duration:

            PAGE.jikan?.duration ||

            "-",

        status:

            PAGE.jikan?.status ||

            "-",

        source:

            PAGE.jikan?.source ||

            "-",

        genres:

            PAGE.jikan?.genres ||

            [],

        studios:

            PAGE.jikan?.studios ||

            [],

        /* ---------- Images ---------- */

        poster:

            PAGE.tmdb?.poster_path ||

            PAGE.jikan?.images?.jpg?.large_image_url ||

            "",

        backdrop:

            PAGE.tmdb?.backdrop_path ||

            "",

        /* ---------- Movie Only ---------- */

        budget:

            PAGE.tmdb?.budget ||

            0,

        collection:

            PAGE.tmdb?.revenue ||

            0

    };

}

/*==========================================================
    RENDER PAGE
==========================================================*/

function renderPage(){

    renderHero();

    renderInfoCards();

    applyTheme();

    renderGenres();

}

/*==========================================================
    HERO
==========================================================*/

function renderHero(){

    const d = PAGE.data;

    /* ---------- Titles ---------- */

    DOM.title.textContent =
        d.title;

    DOM.jpTitle.textContent =
        d.japaneseTitle || "";

    DOM.englishTitle.textContent =
        d.englishTitle || "";

    /* ---------- Overview ---------- */

    DOM.overview.textContent =
        d.synopsis;

    /* ---------- Meta ---------- */

    DOM.year.textContent =
        d.year;

    DOM.episodes.textContent =
        PAGE.type==="movie"

        ?

        d.duration

        :

        `${d.episodes} Episodes`;

    DOM.rating.textContent =
        d.score

        ?

        `⭐ ${d.score}`

        :

        "N/A";

    /* ---------- Poster ---------- */

    if(PAGE.tmdb && PAGE.tmdb.poster_path){

        DOM.poster.src=

CONFIG.TMDB_POSTER+

PAGE.tmdb.poster_path;

    }

    else{

        DOM.poster.src=

PAGE.jikan.images.jpg.large_image_url;

    }

}

/*==========================================================
    GENRES
==========================================================*/

function renderGenres(){

    DOM.genres.innerHTML="";

    PAGE.data.genres.forEach(genre=>{

        const div=document.createElement("div");

        div.className="genre";

        div.innerText=genre.name;

        DOM.genres.appendChild(div);

    });

}

/*==========================================================
    INFORMATION CARDS
==========================================================*/

function renderInfoCards(){

    const d = PAGE.data;

    if(PAGE.type==="movie"){

        renderMovieCards(d);

    }

    else{

        renderSeriesCards(d);

    }

}

/*==========================================================
    SERIES CARDS
==========================================================*/

function renderSeriesCards(d){

DOM.infoCards.innerHTML=

`

<div class="infoCard">

<div class="infoTitle">

Studio

</div>

<div class="infoValue">

${

d.studios.length

?

d.studios[0].name

:

"-"

}

</div>

</div>

<div class="infoCard">

<div class="infoTitle">

Episodes

</div>

<div class="infoValue">

${d.episodes}

</div>

</div>

<div class="infoCard">

<div class="infoTitle">

Source

</div>

<div class="infoValue">

${d.source}

</div>

</div>

<div class="infoCard">

<div class="infoTitle">

Status

</div>

<div class="infoValue">

${d.status}

</div>

</div>

`;

}

/*==========================================================
    MOVIE CARDS
==========================================================*/

function renderMovieCards(d){

DOM.infoCards.innerHTML=

`

<div class="infoCard">

<div class="infoTitle">

Studio

</div>

<div class="infoValue">

${

d.studios.length

?

d.studios[0].name

:

"-"

}

</div>

</div>

<div class="infoCard">

<div class="infoTitle">

Budget

</div>

<div class="infoValue">

${

d.budget

?

"$"+

d.budget.toLocaleString()

:

"-"

}

</div>

</div>

<div class="infoCard">

<div class="infoTitle">

Collection

</div>

<div class="infoValue">

${

d.collection

?

"$"+

d.collection.toLocaleString()

:

"-"

}

</div>

</div>

<div class="infoCard">

<div class="infoTitle">

Awards Won

</div>

<div class="infoValue">

Coming Soon

</div>

</div>

`;

}

/*==========================================================
    DYNAMIC THEME
==========================================================*/

const THEMES={

Naruto:{

primary:"#ff7b00",

secondary:"#0055ff",

accent:"#ffd54f"

},

"Demon Slayer":{

primary:"#2e7d32",

secondary:"#111111",

accent:"#66bb6a"

},

"Jujutsu Kaisen":{

primary:"#6a1b9a",

secondary:"#283593",

accent:"#9575cd"

},

"One Piece":{

primary:"#1565c0",

secondary:"#fbc02d",

accent:"#42a5f5"

},

"Chainsaw Man":{

primary:"#d32f2f",

secondary:"#111111",

accent:"#ef5350"

},

"Attack on Titan":{

primary:"#5d4037",

secondary:"#212121",

accent:"#bcaaa4"

}

};

function applyTheme(){

let theme=null;

const title=PAGE.data.title;

for(const key in THEMES){

if(title.includes(key)){

theme=THEMES[key];

break;

}

}

if(!theme){

theme={

primary:"#6C63FF",

secondary:"#8E44AD",

accent:"#00BCD4"

};

}

document.documentElement.style.setProperty(

"--primary",

theme.primary

);

document.documentElement.style.setProperty(

"--secondary",

theme.secondary

);

document.documentElement.style.setProperty(

"--accent",

theme.accent

);

/* Backdrop */

if(PAGE.tmdb && PAGE.tmdb.backdrop_path){

document.getElementById(

"dynamicBackground"

).style.backgroundImage=

`url(${CONFIG.TMDB_IMAGE}${PAGE.tmdb.backdrop_path})`;

}

}

/*==========================================================
    TRAILER
==========================================================*/

function renderTrailer(){

    if(!PAGE.tmdb){

        DOM.trailer.innerHTML="<h3>No Trailer Available</h3>";

        return;

    }

    const videos=PAGE.tmdb.videos.results;

    const trailer=videos.find(video=>

        video.site==="YouTube" &&

        video.type==="Trailer"

    );

    if(!trailer){

        DOM.trailer.innerHTML="<h3>No Trailer Available</h3>";

        return;

    }

    DOM.trailer.innerHTML=`

    <iframe

        src="https://www.youtube.com/embed/${trailer.key}"

        title="Anime Trailer"

        allowfullscreen>

    </iframe>

    `;

    DOM.youtubeTrailer.href=

        `https://www.youtube.com/watch?v=${trailer.key}`;

}

/*==========================================================
    WATCH PROVIDERS
==========================================================*/

function renderWatchProviders(){

    DOM.providers.innerHTML="";

    if(!PAGE.tmdb) return;

    const providers=

        PAGE.tmdb["watch/providers"]?.results?.IN;

    if(!providers){

        DOM.providers.innerHTML=

        "<p>No streaming information available.</p>";

        return;

    }

    const list=

        providers.flatrate ||

        providers.buy ||

        providers.rent ||

        [];

    list.forEach(provider=>{

        DOM.providers.innerHTML+=`

        <div class="providerCard">

            <img

            src="${CONFIG.TMDB_IMAGE}${provider.logo_path}"

            alt="${provider.provider_name}"

            >

            <h4>

                ${provider.provider_name}

            </h4>

        </div>

        `;

    });

}

/*==========================================================
    IMPORTANT CREW
==========================================================*/

function renderCrew(){

    DOM.crew.innerHTML="";

    if(!PAGE.tmdb) return;

    const crew=PAGE.tmdb.credits.crew;

    const jobs=[

        "Director",

        "Writer",

        "Producer",

        "Original Music Composer",

        "Director of Photography"

    ];

    jobs.forEach(job=>{

        const person=

        crew.find(member=>member.job===job);

        if(!person) return;

        DOM.crew.innerHTML+=`

        <div class="crewCard">

            <img

            src="${
                person.profile_path

                ?

                CONFIG.TMDB_POSTER+

                person.profile_path

                :

                "images/default-person.png"

            }"

            alt="${person.name}"

            >

            <div class="crewRole">

                ${job}

            </div>

            <div class="crewName">

                ${person.name}

            </div>

        </div>

        `;

    });

}

/*==========================================================
    VOICE CAST
==========================================================*/

async function renderVoiceCast(){

    DOM.voice.innerHTML="";

    try{

        const response=await fetch(

`${CONFIG.JIKAN_BASE}/anime/${PAGE.animeId}/characters`

        );

        const json=await response.json();

        const characters=json.data.slice(0,8);

        characters.forEach(character=>{

            if(character.voice_actors.length===0)

                return;

            const actor=

                character.voice_actors[0];

            DOM.voice.innerHTML+=`

            <div class="voiceCard">

                <img

                src="${actor.person.images.jpg.image_url}"

                alt="${actor.person.name}"

                >

                <div class="voiceInfo">

                    <div class="voiceActor">

                        ${actor.person.name}

                    </div>

                    <div class="voiceCharacter">

                        ${character.character.name}

                    </div>

                </div>

            </div>

            `;

        });

    }

    catch(error){

        console.error(

            "Voice Cast Error:",

            error

        );

    }

}
/*==========================================================
    SCREENSHOTS
==========================================================*/

function renderScreenshots(){

    DOM.screenshots.innerHTML="";

    if(!PAGE.tmdb) return;

    const images=PAGE.tmdb.images.backdrops;

    images.slice(0,8).forEach(image=>{

        DOM.screenshots.innerHTML+=`

        <div class="screenshot">

            <img

            src="${CONFIG.TMDB_IMAGE}${image.file_path}"

            alt="Screenshot"

            loading="lazy"

            >

        </div>

        `;

    });

}

/*==========================================================
    RELATED MOVIES
==========================================================*/

async function renderRelatedMovies(){

    DOM.relatedMovies.innerHTML="";

    const title=PAGE.data.title.toLowerCase();

    const franchiseMovies=await getFranchiseMovies(title);

    if(franchiseMovies.length===0){

        document.getElementById(

        "relatedMoviesSection"

        ).style.display="none";

        return;

    }

    franchiseMovies.forEach(movie=>{

        DOM.relatedMovies.innerHTML+=`

        <div class="movieCard"

        onclick="openMovie('${movie.id}')">

            <img

            src="${movie.poster}"

            alt="${movie.title}"

            >

            <div class="movieInfo">

                <h3>

                    ${movie.title}

                </h3>

                <p>

                    ${movie.year}

                </p>

            </div>

        </div>

        `;

    });

}

/*==========================================================
    FRANCHISE MOVIES
==========================================================*/

async function getFranchiseMovies(title){

    /*

    TODO

    Later replace with

    franchise.json

    */

    const map={

        "naruto":[

            {

                id:"28755",

                title:"The Last: Naruto the Movie",

                poster:"images/naruto-last.jpg",

                year:"2014"

            },

            {

                id:"347201",

                title:"Boruto: Naruto the Movie",

                poster:"images/boruto-movie.jpg",

                year:"2015"

            }

        ],

        "demon slayer":[

            {

                id:"635302",

                title:"Mugen Train",

                poster:"images/mugen-train.jpg",

                year:"2020"

            }

        ],

        "jujutsu":[

            {

                id:"810693",

                title:"Jujutsu Kaisen 0",

                poster:"images/jjk0.jpg",

                year:"2021"

            }

        ]

    };

    for(const key in map){

        if(title.includes(key)){

            return map[key];

        }

    }

    return [];

}

/*==========================================================
    SIMILAR ANIME
==========================================================*/

async function renderSimilarAnime(){

    DOM.similarAnime.innerHTML="";

    try{

        const response=await fetch(

`${CONFIG.JIKAN_BASE}/anime/${PAGE.animeId}/recommendations`

        );

        const json=await response.json();

        json.data.slice(0,8).forEach(item=>{

            DOM.similarAnime.innerHTML+=`

            <div

            class="similarCard"

            onclick="openAnime(${item.entry.mal_id})">

                <img

                src="${item.entry.images.jpg.large_image_url}"

                >

                <div class="similarContent">

                    <h3>

                        ${item.entry.title}

                    </h3>

                </div>

            </div>

            `;

        });

    }

    catch(error){

        console.error(error);

    }

}

/*==========================================================
    COMMUNITY RATING
==========================================================*/

let selectedRating="";

document

.querySelectorAll(".reviewBtn")

.forEach(button=>{

button.onclick=()=>{

document

.querySelectorAll(".reviewBtn")

.forEach(b=>b.classList.remove("active"));

button.classList.add("active");

selectedRating=button.innerText;

};

});

/*==========================================================
    USER REVIEWS
==========================================================*/

function submitReview(){

const text=

document

.getElementById("userReview")

.value.trim();

if(text==="") return;

let reviews=

JSON.parse(

localStorage.getItem(

"animeReviews"

)

)||[];

reviews.unshift({

animeId:PAGE.animeId,

title:PAGE.data.title,

rating:selectedRating,

review:text,

date:new Date()

});

localStorage.setItem(

"animeReviews",

JSON.stringify(reviews)

);

document

.getElementById("userReview")

.value="";

loadReviews();

}

function loadReviews(){

DOM.reviewContainer.innerHTML="";

const reviews=

JSON.parse(

localStorage.getItem(

"animeReviews"

)

)||[];

reviews

.filter(r=>

r.animeId==PAGE.animeId

)

.forEach(r=>{

DOM.reviewContainer.innerHTML+=`

<div class="reviewCard">

<h4>

${r.rating}

</h4>

<p>

${r.review}

</p>

</div>

`;

});

}

/*==========================================================
    OPEN PAGES
==========================================================*/

function openAnime(id){

window.location.href=

`anime-detail.html?id=${id}&type=series`;

}

function openMovie(id){

window.location.href=

`movie-detail.html?id=${id}`;
}

/*==========================================================
    FINAL INITIALIZATION
==========================================================*/

function initializeEvents(){

    /* Submit Review */

    const reviewButton=

    document.getElementById(

        "submitReviewBtn"

    );

    if(reviewButton){

        reviewButton.addEventListener(

            "click",

            submitReview

        );

    }

    /* Wishlist */

    const wishlist=

    document.getElementById(

        "wishlistBtn"

    );

    if(wishlist){

        wishlist.addEventListener(

            "click",

            addWishlist

        );

    }

    /* Watch Now */

    const watchNow=

    document.getElementById(

        "watchNowBtn"

    );

    if(watchNow){

        watchNow.addEventListener(

            "click",

            playAnime

        );

    }

}

/*==========================================================
    WISHLIST
==========================================================*/

function addWishlist(){

    let wishlist=

    JSON.parse(

        localStorage.getItem(

            "wishlist"

        )

    ) || [];

    const exists=

    wishlist.find(item=>

        item.id==PAGE.animeId

    );

    if(exists){

        alert(

            "Already in Wishlist"

        );

        return;

    }

    wishlist.push({

        id:PAGE.animeId,

        title:PAGE.data.title,

        poster:DOM.poster.src,

        type:"anime"

    });

    localStorage.setItem(

        "wishlist",

        JSON.stringify(wishlist)

    );

    alert(

        "Added to Wishlist"

    );

}

/*==========================================================
    WATCH NOW
==========================================================*/

function playAnime(){

    alert(

        "Streaming integration will be added later."

    );

}

/*==========================================================
    COMPLETE RENDER
==========================================================*/

async function renderPage(){

    renderHero();

    renderGenres();

    renderInfoCards();

    applyTheme();

    renderTrailer();

    renderWatchProviders();

    renderCrew();

    await renderVoiceCast();

    renderScreenshots();

    await renderRelatedMovies();

    await renderSimilarAnime();

    loadReviews();

    initializeEvents();

}

/*==========================================================
    PAGE READY
==========================================================*/

console.log(

    "Anime Detail Loaded Successfully."

);
