export default async function handler(req, res) {
  try {
    const { path = "", ...rest } = req.query;
    if (!path) return res.status(400).json({ error: "Missing path" });

    const apiKey = process.env.TMDB_API_KEY || "6a782c30983b74d5e01dbab7cf128327";
    const cleanPath = String(path).startsWith("/") ? String(path) : `/${path}`;
    const url = new URL(`https://api.themoviedb.org/3${cleanPath}`);
    url.searchParams.set("api_key", apiKey);

    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, Array.isArray(value) ? value[0] : value);
      }
    }

    const response = await fetch(url.toString(), {
      headers: { accept: "application/json" }
    });
    const text = await response.text();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.status(response.status).send(text);
  } catch (err) {
    res.status(500).json({ error: "tmdb_proxy_failed", message: err.message });
  }
}