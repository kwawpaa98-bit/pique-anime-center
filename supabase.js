// PIQUE GAMES CENTER — shared Supabase connection
(() => {
  const URL = "https://ubyhfqmpatgkvgjhtnkb.supabase.co";
  const KEY = "sb_publishable_3-fiNjVrjdXKE6JyuCal0w_ioF1A1z7";
  if (!window.supabase?.createClient) {
    console.error("Supabase client library did not load.");
    return;
  }
  const client = window.supabase.createClient(URL, KEY);
  window.piqueSupabase = client;

  // Anonymous session ID only; no name, email, or IP is stored by this tracker.
  try {
    let visitorId = localStorage.getItem("pgc-visitor-id");
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem("pgc-visitor-id", visitorId);
    }
    client.from("site_visits").insert({
      visitor_id: visitorId,
      page_path: location.pathname + location.search
    }).then(({ error }) => {
      if (error) console.warn("Visitor tracking could not be saved:", error.message);
    });
  } catch (error) {
    console.warn("Visitor tracking unavailable in this browser session.", error);
  }
})();
