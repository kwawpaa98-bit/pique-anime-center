const GAMES=[
{id:"neon-drift",title:"Neon Drift",category:"Racing",tag:"ARCADE RACING",desc:"Dodge traffic, chain boosts and own the neon highway.",image:"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=90"},
{id:"apex-rally",title:"Apex Rally",category:"Racing",tag:"RALLY CHALLENGE",desc:"Master tight corners and survive a dangerous mountain route.",image:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=90"},
{id:"street-velocity",title:"Street Velocity",category:"Racing",tag:"STREET RACE",desc:"Switch lanes, dodge roadblocks and chase a new high score.",image:"https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=90"},
{id:"cyber-strike",title:"Cyber Strike",category:"Shooting",tag:"ARENA SHOOTER",desc:"Take aim at hostile drones in a neon combat arena.",image:"https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=90"},
{id:"alien-siege",title:"Alien Siege",category:"Shooting",tag:"SPACE DEFENCE",desc:"Defend the outpost from waves of alien invaders.",image:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=90"},
{id:"tank-frontline",title:"Tank Frontline",category:"Shooting",tag:"ARMOURED COMBAT",desc:"Command your tank, line up shots and survive the arena.",image:"https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=1200&q=90"},
{id:"jungle-quest",title:"Jungle Quest",category:"Adventure",tag:"PLATFORM ADVENTURE",desc:"Leap across ancient ruins and collect hidden relics.",image:"https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=90"},
{id:"shadow-runner",title:"Shadow Runner",category:"Adventure",tag:"ENDLESS RUNNER",desc:"Run through a futuristic city and time every jump.",image:"https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=90"},
{id:"crystal-caverns",title:"Crystal Caverns",category:"Adventure",tag:"CAVE EXPLORER",desc:"Explore glowing caves, gather crystals and avoid creatures.",image:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=90"},
{id:"sky-escape",title:"Sky Escape",category:"Adventure",tag:"FLIGHT SURVIVAL",desc:"Pilot through storm clouds, dodge hazards and collect stars.",image:"https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=90"}
];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function card(g){const href=g.game_url||("arena.html?game="+encodeURIComponent(g.id));const external=!!g.game_url;return '<article class="game-card"><a class="game-image" href="'+esc(href)+'"'+(external?' target="_blank" rel="noopener noreferrer"':'')+'><img src="'+g.image+'" alt="'+esc(g.title)+'" loading="lazy"><span class="image-play">▶ PLAY NOW</span><span class="game-chip">'+g.category+'</span></a><div class="game-info"><small>'+esc(g.tag)+'</small><h3>'+esc(g.title)+'</h3><p>'+esc(g.desc)+'</p><a class="play-link" href="'+esc(href)+'"'+(external?' target="_blank" rel="noopener noreferrer"':'')+'>PLAY GAME <span>↗</span></a></div></article>'}
const grid=document.getElementById("gameGrid"),featured=document.getElementById("featuredGames"),search=document.getElementById("gameSearch");let category=new URLSearchParams(location.search).get("category")||"All";
function render(){if(!grid)return;const q=(search?.value||"").toLowerCase().trim();const list=GAMES.filter(g=>(category==="All"||g.category===category)&&[g.title,g.category,g.desc].join(" ").toLowerCase().includes(q));grid.innerHTML=list.map(card).join("");const count=document.getElementById("resultCount");if(count)count.textContent=list.length+" GAMES";const empty=document.getElementById("emptyState");if(empty)empty.hidden=!!list.length}
if(grid){document.querySelectorAll("[data-filter]").forEach(b=>{b.classList.toggle("active",b.dataset.filter===category);b.addEventListener("click",()=>{category=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));render()})});search?.addEventListener("input",render);render()}
if(featured)featured.innerHTML=[GAMES[0],GAMES[3],GAMES[6]].map(card).join("");
document.getElementById("year")?.replaceChildren(String(new Date().getFullYear()));
document.getElementById("menuToggle")?.addEventListener("click",()=>document.getElementById("nav")?.classList.toggle("open"));


// Load games published from the secure admin dashboard. Keep the built-in games
// as a fallback so the library remains usable if the database is unavailable.
(async () => {
  if (!window.piqueSupabase) return;
  try {
    const { data, error } = await window.piqueSupabase.from("games").select("id,slug,title,category,description,image_url,game_url").eq("published", true).order("created_at", { ascending: false });
    if (error || !data?.length) return;
    const remoteGames = data.map(g => ({id:g.slug,title:g.title,category:g.category,tag:g.category.toUpperCase()+" GAME",desc:g.description,image:g.image_url,game_url:g.game_url}));
    GAMES.splice(0, GAMES.length, ...remoteGames);
    render();
    if (featured) featured.innerHTML = GAMES.slice(0,3).map(card).join("");
  } catch (error) { console.warn("Shared game library unavailable:", error); }
})();
