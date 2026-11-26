import { afterEach, describe, expect, it, vi } from "vitest";
import nextConfig from "../next.config";

async function headersForAllPaths() {
  const rules = await nextConfig.headers?.();
  const rule = rules?.find(item => item.source === "/:path*");
  expect(rule).toBeDefined();
  return Object.fromEntries(rule!.headers.map(header => [header.key, header.value]));
}

afterEach(() => { vi.unstubAllEnvs(); });

describe("baseline security headers", () => {
  it("sets a self-only CSP that still allows Next scripts, styles and images", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const headers = await headersForAllPaths();
    expect(headers["Content-Security-Policy"]).toContain("default-src 'self'");
    expect(headers["Content-Security-Policy"]).toContain("script-src 'self' 'unsafe-inline'");
    expect(headers["Content-Security-Policy"]).toContain("style-src 'self' 'unsafe-inline'");
    expect(headers["Content-Security-Policy"]).toContain("img-src 'self' data: blob:");
    expect(headers["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
    expect(headers["Content-Security-Policy"]).toContain("object-src 'none'");
    expect(headers["Content-Security-Policy"]).not.toContain("'unsafe-eval'");
  });

  it.each([
    ["X-Content-Type-Options", "nosniff"],
    ["Referrer-Policy", "strict-origin-when-cross-origin"],
    ["X-Frame-Options", "DENY"],
  ])("sets %s", async (key, value) => {
    const headers = await headersForAllPaths();
    expect(headers[key]).toBe(value);
  });

  it("disables unneeded browser permissions", async () => {
    const headers = await headersForAllPaths();
    expect(headers["Permissions-Policy"]).toBe(
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
    );
  });

  it("keeps the dev HMR channel and eval available in development only", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const headers = await headersForAllPaths();
    expect(headers["Content-Security-Policy"]).toContain("'unsafe-eval'");
    expect(headers["Content-Security-Policy"]).toContain("connect-src 'self' ws: wss:");
  });
});
