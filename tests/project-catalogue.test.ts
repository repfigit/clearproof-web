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
  { ...catalogue, checkedAt: "2026-02-31" },
  { ...catalogue, capacity: "" }, { ...catalogue, explainers: {} },
  { ...catalogue, explainers: [{ ...catalogue.explainers[0], slug: "../private" }] },
  { ...catalogue, explainers: [{ ...catalogue.explainers[0], publishAfter: "invalid" }] },
  { ...catalogue, explainers: [{ ...catalogue.explainers[0], publishAfter: "2026-02-31T00:00:00Z" }] },
  { ...catalogue, explainers: [{ ...catalogue.explainers[0], publishAfter: "1" }] },
  { ...catalogue, explainers: [{ ...catalogue.explainers[0], publishAfter: "2026-10-05" }] },
  { ...catalogue, explainers: [catalogue.explainers[0], catalogue.explainers[0]] },
])("rejects malformed public data rather than promoting unverified links", value => {
  expect(() => parseProjectCatalogue(value, NOW)).toThrow();
});

describe("catalogue availability", () => {
  function captureWarnings() {
    return vi.spyOn(console, "warn").mockImplementation(() => {});
  }

  function failureLogs(warn: ReturnType<typeof captureWarnings>) {
    return warn.mock.calls.map(call => JSON.parse(String(call[0])));
  }

  afterEach(() => { vi.restoreAllMocks(); });

  it("caches a success briefly with revalidation and an operator-owned endpoint", async () => {
    vi.stubEnv("CLEARPROOF_CONTENT_URL", "http://127.0.0.1:43144/catalogue");
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify(catalogue)));
    vi.stubGlobal("fetch", fetcher);
    expect((await loadProjectCatalogue())?.npmVersion).toBe("0.7.0");
    expect(fetcher).toHaveBeenCalledWith("http://127.0.0.1:43144/catalogue", {
      cache: "force-cache",
      next: { revalidate: 60 },
      signal: expect.any(AbortSignal),
    });
  });

  it("serves a cached success without logging", async () => {
    const warn = captureWarnings();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(catalogue))));
    await loadProjectCatalogue();
    expect(warn).not.toHaveBeenCalled();
  });

  it.each([
    { handler: () => Promise.resolve(new Response("missing", { status: 404 })),
      reason: "http_status", fields: { status: 404 } },
    { handler: () => Promise.reject(Object.assign(new Error("timed out"), { name: "TimeoutError" })),
      reason: "timeout", fields: { timeoutMs: 5000 } },
    { handler: () => Promise.reject(new Error("network failure")),
      reason: "network", fields: {} },
    { handler: () => Promise.resolve(new Response("x".repeat(131073))),
      reason: "oversize", fields: { bytes: 131073 } },
    { handler: () => Promise.resolve(new Response("bad JSON")),
      reason: "invalid_json", fields: {} },
    { handler: () => Promise.resolve(new Response(JSON.stringify({ ...catalogue, schemaVersion: 2 }))),
      reason: "invalid_schema", fields: {} },
  ])("logs $reason and returns unavailable", async ({ handler, reason, fields }) => {
    const warn = captureWarnings();
    vi.stubGlobal("fetch", handler);
    expect(await loadProjectCatalogue()).toBeNull();
    expect(failureLogs(warn)).toEqual([
      expect.objectContaining({ event: "project_catalogue_unavailable", reason, ...fields }),
    ]);
  });

  it("logs a timeout while reading the body", async () => {
    const warn = captureWarnings();
    const response = new Response("partial");
    vi.spyOn(response, "text").mockRejectedValue(
      Object.assign(new Error("aborted"), { name: "AbortError" }),
    );
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));
    expect(await loadProjectCatalogue()).toBeNull();
    expect(failureLogs(warn)).toEqual([
      expect.objectContaining({ reason: "timeout", timeoutMs: 5000 }),
    ]);
  });
});
