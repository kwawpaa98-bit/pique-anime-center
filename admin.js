(() => {
  const SUPABASE_URL = "https://ubyhfqmpatgkvgjhtnkb.supabase.co";
  const SUPABASE_KEY = "sb_publishable_3-fiNjVrjdXKE6JyuCal0w_ioF1A1z7";
  const OWNER_EMAIL = "kwawpaa98@gmail.com";
  const $ = (id) => document.getElementById(id);
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const loginPanel = $("loginPanel"), dashboard = $("dashboard");
  const say = (id, message, error=false) => { $(id).textContent = message; $(id).classList.toggle("danger", error); };
  const slugify = (s) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,80) || crypto.randomUUID();
  let games = [];
  function showDashboard(user) {
    if ((user.email || "").toLowerCase() !== OWNER_EMAIL) { say("loginStatus","This account is not authorized to manage this website.",true); client.auth.signOut(); return; }
    loginPanel.classList.add("hidden"); dashboard.classList.remove("hidden"); $("adminEmail").textContent = user.email; loadGames();
  }
  async function loadGames() {
    say("gameStatus","Loading games...");
    const {data,error} = await client.from("games").select("*").order("created_at",{ascending:false});
    if(error){say("gameStatus","Could not load games: "+error.message,true);return;}
    games = data || [];
    $("publishedCount").textContent = games.filter(g=>g.published).length;
    $("draftCount").textContent = games.filter(g=>!g.published).length;
    $("gameList").innerHTML = games.length ? games.map(g => '<article class="admin-game-row"><img src="'+escapeHtml(g.image_url || "")+'" alt=""><div><strong>'+escapeHtml(g.title)+'</strong><small>'+escapeHtml(g.category)+' · '+(g.published?'Published':'Draft')+'</small></div><div><button type="button" data-edit="'+g.id+'">Edit</button> <button type="button" class="danger" data-delete="'+g.id+'">Delete</button></div></article>').join("") : '<p class="status-line">No games have been added yet.</p>';
    say("gameStatus",games.length+" game(s) loaded.");
  }
  function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  $("loginForm").addEventListener("submit",async e=>{e.preventDefault();say("loginStatus","Signing in...");const {data,error}=await client.auth.signInWithPassword({email:$("loginEmail").value.trim(),password:$("loginPassword").value});if(error){say("loginStatus",error.message,true);return;}showDashboard(data.user);});
  $("signOut").addEventListener("click",async()=>{await client.auth.signOut();dashboard.classList.add("hidden");loginPanel.classList.remove("hidden");$("loginPassword").value="";});
  $("clearForm").addEventListener("click",()=>{$("gameForm").reset();$("gameId").value="";$("formTitle").textContent="Add a new game";$("saveGame").textContent="SAVE GAME";});
  $("gameForm").addEventListener("submit",async e=>{e.preventDefault();const title=$("gameTitle").value.trim();const id=$("gameId").value;const record={slug:slugify(title),title,category:$("gameCategory").value,description:$("gameDescription").value.trim(),image_url:$("gameImage").value.trim(),game_url:$("gameUrl").value.trim(),published:$("gamePublished").value==="true",updated_at:new Date().toISOString()};say("gameStatus","Saving game...");
    const result=id?await client.from("games").update(record).eq("id",id):await client.from("games").insert(record);
    if(result.error){say("gameStatus","Save failed: "+result.error.message,true);return;}
    $("gameForm").reset();$("gameId").value="";$("formTitle").textContent="Add a new game";$("saveGame").textContent="SAVE GAME";await loadGames();say("gameStatus","Game saved. Published games are available in the public library.");
  });
  $("gameList").addEventListener("click",async e=>{const edit=e.target.closest("[data-edit]");const del=e.target.closest("[data-delete]");if(edit){const g=games.find(x=>x.id===edit.dataset.edit);if(!g)return;$("gameId").value=g.id;$("gameTitle").value=g.title;$("gameCategory").value=g.category;$("gameDescription").value=g.description;$("gameImage").value=g.image_url||"";$("gameUrl").value=g.game_url;$("gamePublished").value=String(g.published);$("formTitle").textContent="Edit game";$("saveGame").textContent="UPDATE GAME";window.scrollTo({top:0,behavior:"smooth"});}if(del){const g=games.find(x=>x.id===del.dataset.delete);if(!g||!confirm('Delete "'+g.title+'"? This cannot be undone.'))return;const {error}=await client.from("games").delete().eq("id",g.id);if(error){say("gameStatus","Delete failed: "+error.message,true);return;}await loadGames();}});
  client.auth.getSession().then(({data})=>{if(data.session)showDashboard(data.session.user);});
})();