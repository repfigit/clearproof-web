import { createServer } from "node:http";

// Owned loopback-only synthetic source for production-build browser tests.
createServer((_request, response) => {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify({
    schemaVersion: 1, checkedAt: "2026-10-05", npmVersion: "9.9.9",
    proofProfile: "pilot-transfer-v3", stage: "Synthetic development pilot",
    assurance: "Development keys only", capacity: "Software refresh: 256 enrollments",
    explainers: [
      { slug: "published-example", title: "Published synthetic article", publishAfter: "2000-01-01T00:00:00Z" },
      { slug: "future-example", title: "Future synthetic article", publishAfter: "9999-01-01T00:00:00Z" },
    ],
  }));
}).listen(43145, "127.0.0.1");
