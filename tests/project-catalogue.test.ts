import { afterEach, describe, expect, it, vi } from "vitest";
import { loadProjectCatalogue, parseProjectCatalogue } from "../src/lib/project-catalogue";

const catalogue = {
  schemaVersion: 1, checkedAt: "2026-10-05", npmVersion: "0.7.0",
  proofProfile: "pilot-transfer-v3", stage: "Local development pilot",
  assurance: "Development keys", capacity: "Software: 256 enrollments",
  explainers: [
    { slug: "visible", title: "Visible article", publishAfter: "2026-10-05T00:00:00Z" },
    { slug: "future", title: "Scheduled article", publishAfter: "2026-10-07T00:00:00Z" },
  ],
};
const NOW = Date.parse("2026-10-05T12:00:00Z");

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

it("uses catalogue release facts and filters future articles at the publication boundary", () => {
  expect(parseProjectCatalogue(catalogue, NOW)).toEqual({ ...catalogue, explainers: [catalogue.explainers[0]] });
  expect(parseProjectCatalogue(catalogue, Date.parse("2026-10-07T00:00:00Z")).explainers).toHaveLength(2);
  expect(parseProjectCatalogue({ ...catalogue, explainers: [] }, NOW).explainers).toEqual([]);
});

it.each([
  null, [], { ...catalogue, schemaVersion: 2 }, { ...catalogue, npmVersion: "latest" },
  { ...catalogue, checkedAt: "invalid" }, { ...catalogue, proofProfile: "unknown" },
  { ...catalogue, capacity: "" }, { ...catalogue, explainers: {} },
  { ...catalogue, explainers: [{ ...catalogue.explainers[0], slug: "../private" }] },
  { ...catalogue, explainers: [{ ...catalogue.explainers[0], publishAfter: "invalid" }] },
  { ...catalogue, explainers: [catalogue.explainers[0], catalogue.explainers[0]] },
])("rejects malformed public data rather than promoting unverified links", value => {
  expect(() => parseProjectCatalogue(value, NOW)).toThrow();
});

describe("catalogue availability", () => {
  it("fetches fresh server data with a timeout and an operator-owned endpoint", async () => {
    vi.stubEnv("CLEARPROOF_CONTENT_URL", "http://127.0.0.1:43144/catalogue");
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify(catalogue)));
    vi.stubGlobal("fetch", fetcher);
    expect((await loadProjectCatalogue())?.npmVersion).toBe("0.7.0");
    expect(fetcher).toHaveBeenCalledWith("http://127.0.0.1:43144/catalogue", {
      cache: "no-store", signal: expect.any(AbortSignal),
    });
  });

  it.each([
    () => Promise.reject(new Error("network failure")),
    () => Promise.resolve(new Response("missing", { status: 404 })),
    () => Promise.resolve(new Response("bad JSON")),
    () => Promise.resolve(new Response("x".repeat(131073))),
    () => Promise.resolve(new Response(JSON.stringify({ ...catalogue, schemaVersion: 2 }))),
  ])("returns unavailable on request, encoding, size or schema failure", async handler => {
    vi.stubGlobal("fetch", handler);
    expect(await loadProjectCatalogue()).toBeNull();
  });
});
