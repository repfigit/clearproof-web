import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TransferSpecimen } from "@/components/transfer-specimen";
import Image from "next/image";
import Link from "next/link";

const REPO = "https://github.com/repfigit/clearproof";
const DOCS = "https://docs.clearproof.world";

const LIFECYCLE = [
  { step: "01", title: "Enroll", desc: "The customer’s wallet signs consent to a credential from an authorized issuer. The issuer’s credentials are committed to a signed root that verifiers can pin." },
  { step: "02", title: "Evaluate", desc: "The sending institution values the transfer exactly and checks it against the active, reviewed policy. Every outcome is explained: allow, review, deny or indeterminate." },
  { step: "03", title: "Prove", desc: "A Groth16 proof binds the credential, the sanctions status of both wallets, the valuation and the transfer itself. It publishes eight values; everything else stays private." },
  { step: "04", title: "Seal and send", desc: "The information the rules require is encrypted to the receiving institution’s published key and sent alongside the proof." },
  { step: "05", title: "Authorize once", desc: "The receiver checks the proof against current roots, then consumes it. A replay fails. An on-chain registry can mirror the receipt for anyone to inspect." },
  { step: "06", title: "Review later", desc: "An encrypted evidence bundle lets an independent reviewer re-check the decision offline, long after the proof itself has expired." },
];

const LIMITS = [
  { title: "Not legal compliance", desc: "Which information is required, which counterparties are trusted and how long records are kept depend on the deployment and its jurisdiction." },
  { title: "Not the truth of the inputs", desc: "A proof shows the checks ran against credentials and lists someone approved. Deciding to trust those sources is a separate step." },
  { title: "Not settlement", desc: "Acceptance, the counterparty’s response and on-chain settlement are recorded as separate facts." },
  { title: "Not anonymity", desc: "Public signals and on-chain activity can still reveal patterns. The goal is to share personal data only where it is needed." },
];

const EXPLAINERS = [
  { slug: "what-clearproof-does", title: "What clearproof does, and what a valid proof does not establish" },
  { slug: "pilot-proof-public-signals", title: "The eight public signals: what they show and what they hide" },
  { slug: "who-verifies-what", title: "Who verifies what: circuit, registry and application" },
  { slug: "verify-independently", title: "Verifying a clearproof proof without trusting clearproof" },
  { slug: "usd-cents-without-a-price-feed", title: "USD cents without a price feed: how the proof handles valuation" },
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
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <Image src="/logo.png" alt="" width={28} height={28} />
            <span>clear<span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">proof</span></span>
          </Link>
          <div className="flex gap-5 text-sm text-muted-foreground">
            <Link href="#how-it-works" className="hover:text-foreground">How it works</Link>
            <Link href={`${DOCS}/explainers`} className="hover:text-foreground">Explainers</Link>
            <Link href={DOCS} className="hover:text-foreground">Docs</Link>
            <Link href={REPO} className="hover:text-foreground">GitHub</Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/50 via-background to-background" />
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-24 text-center">
          <Badge variant="secondary" className="mb-6 text-xs">Pilot-stage software · Open source</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Prove the checks passed.<br className="hidden sm:block" /> Keep the data sealed.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            clearproof is open-source infrastructure for crypto transfer evidence. A zero-knowledge proof shows a
            transfer passed specific checks, and the personal details the rules require go, encrypted, only to the
            institution entitled to read them.
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground">
            Development software for controlled evaluation. Circuits and contracts have not completed independent audits;
            current proving artifacts use a development-only trusted setup.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href={REPO} className="inline-flex h-11 items-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/80">Explore the source</Link>
            <Link href={`${DOCS}/explainers`} className="inline-flex h-11 items-center rounded-lg border px-6 text-sm font-medium hover:bg-muted">Read the explainers</Link>
          </div>
          <div className="mt-14 text-left">
            <TransferSpecimen />
          </div>
        </div>
      </section>

      <Separator />

      <section id="how-it-works" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">The life of a transfer</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Six steps, from enrolling a customer to letting an auditor re-check the decision long afterwards. Each step
          leaves evidence the next one can verify.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LIFECYCLE.map((item) => (
            <Card key={item.step}><CardContent className="pt-6">
              <p className="font-mono text-sm text-muted-foreground">{item.step}</p>
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </CardContent></Card>
          ))}
        </div>
      </section>

      <Separator />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">What a valid proof does not tell you</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A proof is precise about a narrow statement. Knowing its edges is how you use it well.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {LIMITS.map((item) => (
            <Card key={item.title}><CardContent className="pt-6">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </CardContent></Card>
          ))}
        </div>
      </section>

      <Separator />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">Run the pilot yourself</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Build from source, then follow the local acceptance guide. It generates development keys, starts a throwaway
          database and test chain, and takes a synthetic transfer through every step above with real proofs.
        </p>
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Build from source</h3>
          <pre className="mt-4 overflow-x-auto text-sm"><code>{SETUP}</code></pre>
          <p className="mt-4 text-sm text-muted-foreground">Needs Node, Python 3.12 with uv, Circom 2.2.2 and PostgreSQL 18. Use synthetic data only.</p>
          <Link href={`${REPO}/blob/main/docs/operations/local-pilot-acceptance.md`} className="mt-4 inline-block text-sm underline underline-offset-4">Read the local acceptance guide</Link>
        </div>
      </section>

      <Separator />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">Learn how it works</h2>
        <p className="mt-3 text-muted-foreground">Short, source-checked explainers. Each links to the code and specs it describes.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {EXPLAINERS.map((item) => (
            <Link key={item.slug} href={`${DOCS}/explainers/${item.slug}`} className="group">
              <Card className="h-full transition-colors group-hover:border-foreground/20"><CardContent className="pt-6">
                <p className="font-semibold">{item.title}</p>
              </CardContent></Card>
            </Link>
          ))}
        </div>
        <Link href={`${DOCS}/feed.xml`} className="mt-6 inline-block text-sm underline underline-offset-4">Follow updates by RSS</Link>
      </section>

      <Separator />

      <section id="status" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight">Where the project stands</h2>
          <Badge variant="outline">Checked September 25, 2026</Badge>
        </div>
        <div className="mt-8 rounded-lg border p-6 text-sm text-muted-foreground">
          <p><strong className="text-foreground">Stage:</strong> pilot. The full workflow runs locally with synthetic data, real proofs, a disposable database and a test chain. No customer deployment yet.</p>
          <p className="mt-3"><strong className="text-foreground">Assurance:</strong> circuits and contracts have not been independently audited. Proving keys are for development only.</p>
          <p className="mt-3"><strong className="text-foreground">Capacity:</strong> the current proof profile, pilot-transfer-v3, supports about 4.3 billion credentials per issuer, a million issuers and a million sanctioned addresses.</p>
          <p className="mt-3"><strong className="text-foreground">Packages:</strong> the npm packages (0.3.0) predate the pilot. Use the source for current features.</p>
        </div>
      </section>

      <footer className="border-t py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">clearproof · Open source under Apache-2.0</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href={REPO} className="hover:text-foreground">GitHub</Link>
            <Link href={DOCS} className="hover:text-foreground">Docs</Link>
            <Link href={`${DOCS}/docs/contracts`} className="hover:text-foreground">Testnet contracts</Link>
            <Link href={`${DOCS}/feed.xml`} className="hover:text-foreground">RSS</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
