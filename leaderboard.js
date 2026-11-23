(() => {
  const db = window.piqueSupabase;
  const name = document.getElementById("playerName");
  name.value = localStorage.getItem("pgc-player-name") || "";
  const esc = value => String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
  document.getElementById("saveName").onclick = () => {
    const value = name.value.trim();
    if (value) { localStorage.setItem("pgc-player-name",value); alert("Player name saved. Your next game score will use this name."); }
  };
  async function load() {
    const podium = document.getElementById("podium");
    const scores = document.getElementById("scores");
    if (!db) { podium.textContent = "Leaderboard connection unavailable."; return; }
    const { data, error } = await db.from("game_scores").select("player_name,game_name,score,created_at").order("score",{ascending:false}).order("created_at",{ascending:true}).limit(100);
    if (error) { podium.textContent = "Could not load rankings: " + error.message; return; }
    const rows = data || [];
    const top = rows.slice(0,3);
    podium.innerHTML = top.length ? top.map((p,i)=>'<div class="podium-place"><b>'+(i===0?'🏆 #1':i===1?'🥈 #2':'🥉 #3')+'</b><strong>'+esc(p.player_name)+'</strong><small>'+Number(p.score).toLocaleString()+' pts</small></div>').join("") : '<div class="community-note" style="grid-column:1/-1">No scores yet. Play a game and finish a round to enter the rankings.</div>';
    scores.innerHTML = rows.length ? rows.slice(0,30).map((p,i)=>'<tr><td>#'+(i+1)+'</td><td>'+esc(p.player_name)+'</td><td>'+esc(p.game_name)+'</td><td>'+Number(p.score).toLocaleString()+'</td></tr>').join("") : '<tr><td colspan="4">No scores recorded yet. Be the first champion!</td></tr>';
  }
  load();
})();
