const animeTitles=[
 ["One Piece","Adventure • Action"],["Naruto","Action • Ninja"],["Bleach","Action • Supernatural"],["Dragon Ball","Action • Adventure"],
 ["Solo Leveling","Fantasy • Action"],["Jujutsu Kaisen","Dark Fantasy"],["Demon Slayer","Action • Fantasy"],["One Punch Man","Action • Comedy"],
 ["Kaiju No. 8","Action • Sci-Fi"],["Wistoria: Wand and Sword","Fantasy"],["Black Clover","Fantasy • Adventure"],["The Apothecary Diaries","Mystery • Drama"]
];
const animeGrid=document.getElementById("animeGrid");
function showAnime(filter=""){animeGrid.innerHTML="";animeTitles.filter(a=>a[0].toLowerCase().includes(filter.toLowerCase())).forEach(a=>{const card=document.createElement("article");card.className="anime-card";const title=document.createElement("h3");title.textContent=a[0];const desc=document.createElement("p");desc.textContent=a[1];const cat=document.createElement("span");cat.className="category";cat.textContent="ANIME COLLECTION";card.append(cat,title,desc);animeGrid.append(card)})}
showAnime();document.getElementById("search").addEventListener("input",e=>showAnime(e.target.value.trim()));
const episodeGrid=document.getElementById("episodeGrid"),dialog=document.getElementById("episodeDialog");
const authorizedEpisodeLinks={}; // Add only links you are authorized to publish, e.g. 890: "https://..."
function renderEpisodes(filter=""){episodeGrid.innerHTML="";for(let n=890;n<=1085;n++){if(!String(n).includes(filter))continue;const row=document.createElement("div");row.className="episode";const label=document.createElement("span");label.textContent="Episode "+n;const btn=document.createElement("button");btn.textContent="Details";btn.addEventListener("click",()=>openEpisode(n));row.append(label,btn);episodeGrid.append(row)}}
function openEpisode(n){document.getElementById("dialogTitle").textContent="One Piece — Episode "+n;const link=authorizedEpisodeLinks[n];const watch=document.getElementById("watchLink");if(link){watch.href=link;watch.classList.remove("hidden");document.getElementById("dialogText").textContent="Open the authorized viewing source for this episode."}else{watch.classList.add("hidden");document.getElementById("dialogText").textContent="An authorized viewing link has not been added for this episode yet."}dialog.showModal()}
renderEpisodes();document.getElementById("episodeSearch").addEventListener("input",e=>renderEpisodes(e.target.value.trim()));
document.getElementById("closeDialog").addEventListener("click",()=>dialog.close());
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("nav").classList.toggle("open"));
document.getElementById("year").textContent=new Date().getFullYear();
