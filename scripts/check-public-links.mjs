const origin = "https://www.clearproof.world";
const homepage = await fetch(origin, { signal: AbortSignal.timeout(20_000) });
if (!homepage.ok) throw new Error(`Homepage HTTP ${homepage.status}`);
const html = await homepage.text();
const links = [...new Set([...html.matchAll(/href="(https:\/\/docs\.clearproof\.world[^"#]*)"/g)].map(match => match[1]))];
if (links.length === 0) throw new Error("No documentation links were rendered");
for (const url of [...links, `${origin}/robots.txt`, `${origin}/sitemap.xml`]) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  await response.body?.cancel();
}
const response = await fetch("https://docs.clearproof.world/api/content/project", { signal: AbortSignal.timeout(20_000) });
if (!response.ok) throw new Error(`Project catalogue HTTP ${response.status}`);
const catalogue = await response.json();
if (!html.includes(`Verified npm release: ${catalogue.npmVersion}.`)) {
  throw new Error("Homepage release status differs from the public catalogue");
}
console.log(`Verified ${links.length} documentation links, metadata routes and release status.`);
