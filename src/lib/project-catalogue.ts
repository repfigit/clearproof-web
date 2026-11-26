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

// Full SemVer 2.0.0, including prerelease and build metadata.
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(?:\+[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*)?$/;
// Documented profile names are lowercase slug words with a version suffix, e.g.
// pilot-transfer-v3 or legacy-v1. New profiles need no schema change.
const PROFILE_NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*-v[1-9]\d*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

function invalid(detail: string): Error {
  return new Error(`Invalid public project catalogue: ${detail}`);
}

export function parseProjectCatalogue(value: unknown, now = Date.now()): ProjectCatalogue {
  if (!record(value)) throw invalid("expected a JSON object");
  if (value.schemaVersion !== 1) throw invalid("schemaVersion must be 1");
  if (!text(value.checkedAt, 10) || !DATE.test(value.checkedAt)
    || !Number.isFinite(Date.parse(value.checkedAt))
    || new Date(value.checkedAt).toISOString().slice(0, 10) !== value.checkedAt) {
    throw invalid("checkedAt must be a real calendar date in YYYY-MM-DD form");
  }
  if (!text(value.npmVersion, 128)) {
    throw invalid("npmVersion must be 1-128 characters");
  }
  if (!SEMVER.test(value.npmVersion)) {
    throw invalid("npmVersion must be a SemVer version such as 1.2.3, 1.2.3-rc.1 or 1.2.3+build.7");
  }
  if (!text(value.proofProfile, 64)) {
    throw invalid("proofProfile must be 1-64 characters");
  }
  if (!PROFILE_NAME.test(value.proofProfile)) {
    throw invalid("proofProfile must be a documented profile name ending in -vN, such as pilot-transfer-v3 or legacy-v1");
  }
  if (!text(value.stage)) throw invalid("stage must be a non-empty string");
  if (!text(value.assurance)) throw invalid("assurance must be a non-empty string");
  if (!text(value.capacity)) throw invalid("capacity must be a non-empty string");
  if (!Array.isArray(value.explainers)) throw invalid("explainers must be an array");
  if (value.explainers.length > 100) throw invalid("explainers must contain at most 100 items");
  const seen = new Set<string>();
  const explainers = value.explainers.map(item => {
    if (!record(item)) throw invalid("each explainer must be an object");
    if (!text(item.slug, 100) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) {
      throw invalid(`explainer slug ${JSON.stringify(item.slug)} must be a lowercase hyphenated slug`);
    }
    if (seen.has(item.slug)) throw invalid(`duplicate explainer slug ${item.slug}`);
    if (!text(item.title, 512)) throw invalid(`explainer ${item.slug} title must be a non-empty string`);
    if (!text(item.publishAfter, 32) || !TIMESTAMP.test(item.publishAfter)
      || !Number.isFinite(Date.parse(item.publishAfter))
      || new Date(item.publishAfter).toISOString().slice(0, 10) !== item.publishAfter.slice(0, 10)) {
      throw invalid(`explainer ${item.slug} publishAfter must be a UTC ISO timestamp`);
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
