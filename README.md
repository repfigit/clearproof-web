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

The homepage loads `https://docs.clearproof.world/api/content/project` and keeps
a successful response in Next's server data cache for 60 seconds before
revalidating in the background. The core repository's
`packages/content/src/project.ts` owns release, profile, assurance and capacity
statements. Its approved explainer catalogue owns titles and publication dates.
Scheduled articles and paused publications are excluded by the documentation
service and checked again by this website on every render.

Set `CLEARPROOF_CONTENT_URL` to a documentation preview's `/api/content/project`
URL for local development or previews. This is an operator-controlled server
variable, not visitor input. Requests time out after five seconds. If the source
is unavailable or malformed, the homepage displays a status-unavailable notice
and links to the index without guessing article URLs or promoting a stale
release; a previously cached success may be shown for up to the 60-second
revalidation window. Structured warnings record the failure reason. Deploy the
documentation endpoint before a website change that depends on it. Publishing a
new explainer needs no website commit.

## Evaluation entry

The homepage links both the small historical-proof verification example and the
complete current local pilot. Its evaluation link opens the documentation guide,
report template and voluntary GitHub feedback form. Deploy and verify
`https://docs.clearproof.world/docs/evaluate` before promoting a website revision
that depends on this route. Site visits or link clicks do not establish an
external evaluation or adoption.

## Security headers

`next.config.ts` sets baseline security headers on every route: an enforcing
Content-Security-Policy, `nosniff`, `strict-origin-when-cross-origin` referrer
policy, `X-Frame-Options: DENY` with `frame-ancestors 'none'`, and a restrictive
Permissions-Policy. Scripts, styles, fonts and images remain same-origin, so
`/_next/*` output and `public/` files keep working. The policy allows inline
scripts and styles because the app does not use a Proxy-generated nonce yet.

Roll out CSP to a preview first and check the browser console and HTML-validated
assets before production. If a deployment adds third-party embeds, analytics or
fonts, extend the matching directive rather than dropping `default-src`.

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
CI gate; inspect the full `npm audit` report as well. On October 6, 2026, the
production audit reported zero advisories after updating Base UI to 1.8.0,
Tailwind CSS and its PostCSS plugin to 4.3.3, and React types to 19.3.0. Five high-severity entries remain in
the development-only ESLint → fast-glob → micromatch → braces chain; braces
3.0.3 has no patched release available. These tools process repository files in
CI, not visitor-supplied patterns. The production-only audit does not establish
that the entire development dependency tree is unaffected. Recheck upstream
fixes rather than forcing an incompatible ESLint downgrade.

ESLint remains on 9.39.4. The existing [ESLint 10 update](https://github.com/repfigit/clearproof-web/pull/15)
fails `npm run lint` because the current React lint plugin calls the removed
`getFilename` API. Its [CI log](https://github.com/repfigit/clearproof-web/actions/runs/37385040040/job/112016120225)
records the failure. Upgrade after the Next.js lint configuration and its React
plugin support ESLint 10; keep lint enabled in the meantime.

## Hosting

The linked Vercel project is `clearproof-web`. Production uses
https://www.clearproof.world. Validate a preview before promoting it and run the
live link check afterward. Keep deployment credentials and `.env.local` out of
Git. A successful local build alone does not prove the public deployment updated.
