(() => {
  const db = window.piqueSupabase;
  const form = document.getElementById("postForm");
  const list = document.getElementById("postList");
  const esc = value => String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
  function render(posts) {
    list.innerHTML = posts.length
      ? posts.map(p => '<article class="post-card"><strong>'+esc(p.player_name)+'</strong><small>'+new Date(p.created_at).toLocaleString()+'</small><p>'+esc(p.body)+'</p></article>').join("")
      : '<p class="community-note">No discussions yet. Be the first to start one!</p>';
  }
  async function load() {
    if (!db) { list.textContent = "Community connection is unavailable. Please refresh later."; return; }
    const { data, error } = await db.from("community_posts").select("id,player_name,body,created_at").order("created_at",{ascending:false}).limit(60);
    if (error) { list.textContent = "Could not load discussions: " + error.message; return; }
    render(data || []);
  }
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const name = document.getElementById("postName").value.trim();
    const body = document.getElementById("postText").value.trim();
    if (!name || !body || !db) return;
    const button = form.querySelector("button[type=submit]");
    button.disabled = true; button.textContent = "POSTING…";
    const { error } = await db.from("community_posts").insert({ player_name:name, body });
    button.disabled = false; button.textContent = "POST TO COMMUNITY ↗";
    if (error) { alert("Your post could not be shared: " + error.message); return; }
    document.getElementById("postText").value = "";
    await load();
  });
  load();
  if (db) db.channel("pique-community-live")
    .on("postgres_changes",{event:"*",schema:"public",table:"community_posts"},load)
    .subscribe();
})();
