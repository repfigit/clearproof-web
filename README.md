# clearproof.world

Public website for Clearproof's development pilot. The implementation is in the
[core repository](https://github.com/repfigit/clearproof); technical documentation
is at [docs.clearproof.world](https://docs.clearproof.world).

## Development

Use Node.js 24 or later and the committed lockfile:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The synthetic transfer animation illustrates the
information flow; it does not generate or authorize a cryptographic proof.

## Release and publication source

The homepage loads `https://docs.clearproof.world/api/content/project` on each
request. The core repository's `packages/content/src/project.ts` owns release,
profile, assurance and capacity statements. Its approved explainer catalogue
owns titles and publication dates. Scheduled articles and paused publications
are excluded by the documentation service and checked again by this website.

Set `CLEARPROOF_CONTENT_URL` to a documentation preview's `/api/content/project`
URL for local development or previews. This is an operator-controlled server
variable, not visitor input. Requests time out after five seconds. If the source
is unavailable or malformed, the homepage displays a status-unavailable notice
and links to the index without guessing article URLs or showing a stale release.
Deploy the documentation endpoint before a website change that depends on it.
Publishing a new explainer needs no website commit.

## Validation

```sh
npm run lint
npm run test:unit
npm run build
npm run typecheck
npm exec -- playwright install --with-deps chromium firefox webkit
npm run test:e2e
npm audit --omit=dev --audit-level=high
```

Browser tests own a fixture catalogue and a production Next.js server. They
cover desktop, mobile, Firefox, WebKit, reduced motion, metadata routes and
future publication filtering without depending on the public docs service.
After deploying both projects, `npm run test:links` checks promoted public links,
robots/sitemap and the shared release version against the live sites. CI runs
local checks on pull requests and daily, and live checks daily.

## Dependency maintenance

Dependabot checks npm and GitHub Actions weekly. Production audit results are a
CI gate; inspect the full `npm audit` report as well. On October 5, 2026, the
production audit reported zero advisories. Five high-severity entries remain in
the development-only ESLint → fast-glob → micromatch → braces chain; braces
3.0.3 has no patched release available. These tools process repository files in
CI, not visitor-supplied patterns. The production-only audit does not establish
that the entire development dependency tree is unaffected. Recheck upstream
fixes rather than forcing an incompatible ESLint downgrade.

## Hosting

The linked Vercel project is `clearproof-web`. Production uses
https://www.clearproof.world. Validate a preview before promoting it and run the
live link check afterward. Keep deployment credentials and `.env.local` out of
Git. A successful local build alone does not prove the public deployment updated.
