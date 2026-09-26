import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TransferSpecimen } from "@/components/transfer-specimen";
import Image from "next/image";
import Link from "next/link";

const REPO = "https://github.com/repfigit/clearproof";
const DOCS = "https://docs.clearproof.world";

const LIFECYCLE = [
  {
    title: "Enroll",
    body: "The customer’s wallet signs consent to a credential from an authorized issuer. The issuer’s credentials are committed to a signed root that verifiers can pin.",
  },
  {
    title: "Evaluate",
    body: "The sending institution values the transfer exactly and checks it against the active, reviewed policy. Every outcome is explained: allow, review, deny or indeterminate.",
  },
  {
    title: "Prove",
    body: "A Groth16 proof binds the credential, the sanctions status of both wallets, the valuation and the transfer itself. It publishes eight values; everything else stays private.",
  },
  {
    title: "Authorize once",
    body: "The sending institution’s authorization service checks the proof against current roots, revocation and the active policy. Only an allow decision consumes it, and only once; a replay fails.",
  },
  {
    title: "Seal and send",
    body: "The information the rules require is encrypted to the receiving institution’s published key and sent with the proof and a signed decision. An on-chain registry can mirror the receipt for anyone to inspect.",
  },
  {
    title: "Review later",
    body: "An encrypted evidence bundle lets an independent reviewer re-check the decision offline, long after the proof itself has expired.",
  },
];

const LIMITS = [
  {
    title: "Not legal compliance",
    body: "Which information is required, which counterparties are trusted and how long records are kept depend on the deployment and its jurisdiction.",
  },
  {
    title: "Not the truth of the inputs",
    body: "A proof shows the checks ran against credentials and lists someone approved. Deciding to trust those sources is a separate step.",
  },
  {
    title: "Not settlement",
    body: "Acceptance, the counterparty’s response and on-chain settlement are recorded as separate facts.",
  },
  {
    title: "Not anonymity",
    body: "Public signals and on-chain activity can still reveal patterns. The goal is to share personal data only where it is needed.",
  },
];

const EXPLAINERS = [
  { slug: "what-clearproof-does", title: "What clearproof does, and what a valid proof does not establish" },
  { slug: "pilot-proof-public-signals", title: "The eight public signals: what they show and what they hide" },
  { slug: "who-verifies-what", title: "Who verifies what: circuit, registry and application" },
  { slug: "verify-independently", title: "Verifying a clearproof proof without trusting clearproof" },
  { slug: "usd-cents-without-a-price-feed", title: "USD cents without a price feed: how the proof handles valuation" },
];

const STATUS = [
  { term: "Stage", detail: "Pilot. The full workflow runs locally with synthetic data, real proofs, a disposable database and a test chain. No customer deployment yet." },
  { term: "Assurance", detail: "Circuits and contracts have not been independently audited. Proving keys are for development only." },
  { term: "Capacity", detail: "The current proof profile, pilot-transfer-v3, supports about 4.3 billion credentials per issuer, a million issuers and a million sanctioned addresses." },
  { term: "Packages", detail: "The npm packages (0.3.0) predate the pilot. Use the source for current features." },
];

const SETUP = `git clone ${REPO}.git
cd clearproof
npm exec --yes --package=npm@11.9.0 -- npm ci
uv sync --frozen --extra dev --python 3.12
npm run build`;

export default function Home() {
  return (
    <main className="flex-1">
      <nav aria-label="Main navigation" className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <Image src="/logo.png" alt="" width={28} height={28} />
            <span>clear<span className="text-gradient">proof</span></span>
          </Link>
          <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
            <Link href="#how-it-works" className="hover:text-foreground">How it works</Link>
            <Link href={`${DOCS}/explainers`} className="hover:text-foreground">Explainers</Link>
            <Link href={DOCS} className="hover:text-foreground">Docs</Link>
            <Link href={REPO} className="hover:text-foreground">GitHub</Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-background to-background" />
        <div className="hero-grid absolute inset-0" />
        <div className="absolute left-1/2 top-[-12rem] h-[28rem] w-[56rem] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 text-center sm:pt-24">
          <Badge variant="secondary" className="mb-6 border border-white/10 bg-white/5 text-xs">
            Open source · Pilot-stage · Zero-knowledge
          </Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            Prove the checks passed.{" "}
            <br className="hidden sm:block" />
            <span className="text-gradient">Keep the data sealed.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            clearproof is open-source infrastructure for crypto transfer evidence. A zero-knowledge proof shows a
            transfer passed specific checks, and the personal details the rules require go, encrypted, only to the
            institution entitled to read them.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href={REPO}
              className="inline-flex h-11 items-center rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 px-6 text-sm font-semibold text-white shadow-[0_0_28px_-6px_#6366f1] hover:brightness-110"
            >
              Explore the source
            </Link>
            <Link href={`${DOCS}/explainers`} className="inline-flex h-11 items-center rounded-lg border border-white/15 bg-white/5 px-6 text-sm font-medium hover:bg-white/10">
              Read the explainers
            </Link>
          </div>

          <div className="mt-16 text-left">
            <TransferSpecimen />
          </div>
        </div>
      </section>

      <Separator />

      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">The life of a transfer</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Six steps, from enrolling a customer to letting an auditor re-check the decision long afterwards. Each step
          leaves evidence the next one can verify.
        </p>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LIFECYCLE.map((step, index) => (
            <li key={step.title}>
              <Card className="h-full border-white/10 bg-card/60 transition-colors hover:border-indigo-400/40">
                <CardContent className="pt-6">
                  <p className="text-gradient font-mono text-sm font-semibold">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <Separator />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">What a valid proof does not tell you</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A proof is precise about a narrow statement. Knowing its edges is how you use it well.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {LIMITS.map((limit) => (
            <Card key={limit.title} className="border-white/10 bg-card/60">
              <CardContent className="pt-6">
                <h3 className="font-semibold">{limit.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{limit.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-500/10 via-background to-background" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Run the pilot yourself</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Build from source, then follow the local acceptance guide. It generates development keys, starts a
              throwaway database and test chain, and takes a synthetic transfer through every step above with real
              proofs.
            </p>
            <Link
              href={`${REPO}/blob/main/docs/operations/local-pilot-acceptance.md`}
              className="mt-6 inline-block text-sm font-medium text-cyan-300 underline underline-offset-4 hover:text-cyan-200"
            >
              Open the local acceptance guide
            </Link>
          </div>
          <div className="min-w-0 rounded-xl border border-white/10 bg-black/40 shadow-[0_0_60px_-24px_#22d3ee]">
            <div className="flex gap-1.5 border-b border-white/10 px-4 py-3" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed text-cyan-50/90">
              <code>{SETUP}</code>
            </pre>
            <p className="border-t border-white/10 px-5 py-3 text-xs text-muted-foreground">
              Needs Node, Python 3.12 with uv, Circom 2.2.2 and PostgreSQL 18. Use synthetic data only.
            </p>
          </div>
        </div>
      </section>

      <Separator />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Learn how it works</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Short, source-checked explainers. Each links to the code and specs it describes.
            </p>
          </div>
          <Link href={`${DOCS}/feed.xml`} className="text-sm font-medium text-cyan-300 underline underline-offset-4 hover:text-cyan-200">
            Follow updates by RSS
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPLAINERS.map((item) => (
            <Link key={item.slug} href={`${DOCS}/explainers/${item.slug}`} className="group">
              <Card className="h-full border-white/10 bg-card/60 transition-colors group-hover:border-cyan-400/40">
                <CardContent className="pt-6">
                  <p className="font-medium group-hover:text-cyan-200">{item.title}</p>
                  <p className="mt-3 text-sm text-muted-foreground">Read the explainer</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <Separator />

      <section id="status" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight">Where the project stands</h2>
          <Badge variant="outline" className="border-white/15">Checked September 25, 2026</Badge>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {STATUS.map((item) => (
            <Card key={item.term} className="border-white/10 bg-card/60">
              <CardContent className="pt-6">
                <h3 className="font-semibold">{item.term}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">clearproof · Open source under Apache-2.0</p>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Link href={REPO} className="hover:text-foreground">GitHub</Link>
            <Link href={DOCS} className="hover:text-foreground">Docs</Link>
            <Link href={`${DOCS}/docs/contracts`} className="hover:text-foreground">Testnet contracts</Link>
            <Link href={`${REPO}/issues/new/choose`} className="hover:text-foreground">Report an issue</Link>
            <Link href={`${DOCS}/feed.xml`} className="hover:text-foreground">RSS</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
