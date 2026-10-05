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

export async function loadProjectCatalogue(): Promise<ProjectCatalogue | null> {
  try {
    const response = await fetch(process.env.CLEARPROOF_CONTENT_URL ?? `${DOCS}/api/content/project`, {
      cache: "no-store", signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const body = await response.text();
    if (body.length > 131072) return null;
    return parseProjectCatalogue(JSON.parse(body));
  } catch {
    // Never promote guessed or cached unpublished article URLs on failure.
    return null;
  }
}
