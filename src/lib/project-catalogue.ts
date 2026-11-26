export const DOCS = "https://docs.clearproof.world";

export interface ProjectCatalogue {
  schemaVersion: 1;
  checkedAt: string;
  npmVersion: string;
  proofProfile: string;
  stage: string;
  assurance: string;
  capacity: string;
  explainers: { slug: string; title: string; publishAfter: string }[];
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function text(value: unknown, limit = 2048): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= limit;
}

export function parseProjectCatalogue(value: unknown, now = Date.now()): ProjectCatalogue {
  if (!record(value) || value.schemaVersion !== 1
    || !text(value.checkedAt, 10) || !/^\d{4}-\d{2}-\d{2}$/.test(value.checkedAt)
    || !Number.isFinite(Date.parse(value.checkedAt))
    || new Date(value.checkedAt).toISOString().slice(0, 10) !== value.checkedAt
    || !text(value.npmVersion, 32) || !/^\d+\.\d+\.\d+$/.test(value.npmVersion)
    || !text(value.proofProfile, 64) || !/^pilot-transfer-v[1-9]\d*$/.test(value.proofProfile)
    || !text(value.stage) || !text(value.assurance) || !text(value.capacity)
    || !Array.isArray(value.explainers) || value.explainers.length > 100) {
    throw new Error("Invalid public project catalogue");
  }
  const seen = new Set<string>();
  const explainers = value.explainers.map(item => {
    if (!record(item) || !text(item.slug, 100) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)
      || seen.has(item.slug) || !text(item.title, 512) || !text(item.publishAfter, 32)
      || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(item.publishAfter)
      || !Number.isFinite(Date.parse(item.publishAfter))
      || new Date(item.publishAfter).toISOString().slice(0, 10) !== item.publishAfter.slice(0, 10)) {
      throw new Error("Invalid public explainer");
    }
    seen.add(item.slug);
    return { slug: item.slug, title: item.title, publishAfter: item.publishAfter };
  }).filter(item => Date.parse(item.publishAfter) <= now);
  return {
    schemaVersion: 1, checkedAt: value.checkedAt, npmVersion: value.npmVersion,
    proofProfile: value.proofProfile, stage: value.stage, assurance: value.assurance,
    capacity: value.capacity, explainers,
  };
}

const CATALOGUE_TIMEOUT_MS = 5000;
const CATALOGUE_MAX_BYTES = 131072;
const CATALOGUE_REVALIDATE_SECONDS = 60;

type CatalogueFailure =
  | { reason: "timeout"; timeoutMs: number }
  | { reason: "network" }
  | { reason: "http_status"; status: number }
  | { reason: "body_read" }
  | { reason: "oversize"; bytes: number }
  | { reason: "invalid_json" }
  | { reason: "invalid_schema" };

function logCatalogueFailure(failure: CatalogueFailure, error?: unknown): void {
  const detail = error instanceof Error
    ? { error: error.name, message: error.message.slice(0, 200) }
    : {};
  console.warn(JSON.stringify({
    event: "project_catalogue_unavailable",
    ...failure,
    ...detail,
  }));
}

function isTimeout(error: unknown): boolean {
  return error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
}

export async function loadProjectCatalogue(): Promise<ProjectCatalogue | null> {
  let response: Response;
  try {
    response = await fetch(process.env.CLEARPROOF_CONTENT_URL ?? `${DOCS}/api/content/project`, {
      // Keep a successful catalogue warm for a short window, then revalidate.
      // Scheduled explainers are still filtered per render against publishAfter.
      cache: "force-cache",
      next: { revalidate: CATALOGUE_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(CATALOGUE_TIMEOUT_MS),
    });
  } catch (error) {
    logCatalogueFailure(isTimeout(error)
      ? { reason: "timeout", timeoutMs: CATALOGUE_TIMEOUT_MS }
      : { reason: "network" }, error);
    return null;
  }

  if (!response.ok) {
    logCatalogueFailure({ reason: "http_status", status: response.status });
    return null;
  }

  let body: string;
  try {
    body = await response.text();
  } catch (error) {
    logCatalogueFailure(isTimeout(error)
      ? { reason: "timeout", timeoutMs: CATALOGUE_TIMEOUT_MS }
      : { reason: "body_read" }, error);
    return null;
  }

  const bytes = new TextEncoder().encode(body).length;
  if (bytes > CATALOGUE_MAX_BYTES) {
    logCatalogueFailure({ reason: "oversize", bytes });
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch (error) {
    logCatalogueFailure({ reason: "invalid_json" }, error);
    return null;
  }

  try {
    return parseProjectCatalogue(parsed);
  } catch (error) {
    // A failed refresh must never promote guessed links or a stale release.
    logCatalogueFailure({ reason: "invalid_schema" }, error);
    return null;
  }
}
