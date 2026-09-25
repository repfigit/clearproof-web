import Image from "next/image";
import Link from "next/link";
import { TransferSpecimen } from "@/components/transfer-specimen";

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
    title: "Seal and send",
    body: "The information the rules require is encrypted to the receiving institution’s published key and sent alongside the proof.",
  },
  {
    title: "Authorize once",
    body: "The receiver checks the proof against current roots, then consumes it. A replay fails. An on-chain registry can mirror the receipt for anyone to inspect.",
  },
  {
    title: "Review later",
    body: "An encrypted evidence bundle lets an independent reviewer re-check the decision offline, long after the proof itself has expired.",
  },
];

const LIMITS = [
  {
    title: "It does not make a transfer legally compliant.",
    body: "Which information is required, which counterparties are trusted and how long records are kept depend on the deployment and its jurisdiction.",
  },
  {
    title: "It does not make the inputs true.",
    body: "A proof shows the checks ran against credentials and lists someone approved. Deciding to trust those sources is a separate step.",
  },
  {
    title: "It does not mean the transfer settled.",
    body: "Acceptance, the counterparty’s response and on-chain settlement are recorded as separate facts.",
  },
  {
    title: "It is not anonymity.",
    body: "Public signals and on-chain activity can still reveal patterns. The goal is to share personal data only where it is needed.",
  },
];

const EXPLAINERS = [
  { slug: "what-clearproof-does", title: "What Clearproof does, and what a valid proof does not establish" },
  { slug: "pilot-proof-public-signals", title: "The eight public signals: what they show and what they hide" },
  { slug: "who-verifies-what", title: "Who verifies what: circuit, registry and application" },
  { slug: "verify-independently", title: "Verifying a Clearproof proof without trusting Clearproof" },
  { slug: "usd-cents-without-a-price-feed", title: "USD cents without a price feed: how the proof handles valuation" },
];

const STATUS = [
  { term: "Stage", detail: "Pilot. The full workflow runs locally with synthetic data, real proofs, a disposable database and a test chain. No customer deployment yet." },
  { term: "Assurance", detail: "Circuits and contracts have not been independently audited. Proving keys are for development only." },
  { term: "Capacity", detail: "The current proof profile, pilot-transfer-v3, supports about 4.3 billion credentials per issuer, a million issuers and a million sanctioned addresses." },
  { term: "Packages", detail: "The npm packages (0.3.0) predate the pilot. Use the source for current features." },
  { term: "License", detail: "Apache-2.0." },
];

const SETUP = `git clone ${REPO}.git
cd clearproof
npm exec --yes --package=npm@11.9.0 -- npm ci
uv sync --frozen --extra dev --python 3.12
npm run build`;

export default function Home() {
  return (
    <>
      <header className="border-b border-rule">
        <nav aria-label="Main" className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
            <Image src="/logo.png" alt="" width={26} height={26} />
            Clearproof
          </Link>
          <ul className="flex flex-wrap gap-x-6 gap-y-1 text-[15px] text-muted">
            <li><Link href="#how-it-works" className="hover:text-ink">How it works</Link></li>
            <li><Link href={`${DOCS}/explainers`} className="hover:text-ink">Explainers</Link></li>
            <li><Link href={DOCS} className="hover:text-ink">Docs</Link></li>
            <li><Link href={REPO} className="hover:text-ink">GitHub</Link></li>
          </ul>
        </nav>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pt-14">
          <div className="max-w-5xl">
            <h1 className="text-[2.6rem] font-extrabold leading-[1.05] tracking-[-0.025em] sm:text-6xl">
              Prove the checks passed.{" "}<br className="hidden sm:block" />Keep the customer&rsquo;s data sealed.
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg text-muted sm:text-xl sm:leading-relaxed">
              Clearproof is open-source infrastructure for crypto transfer evidence. A zero-knowledge proof shows a
              transfer passed specific checks, and the personal details the rules require go, encrypted, only to the
              institution entitled to read them.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={REPO} className="inline-flex h-11 items-center rounded-md bg-ink px-5 font-semibold text-white hover:bg-ink/85">
                Explore the source
              </Link>
              <Link href={`${DOCS}/explainers`} className="inline-flex h-11 items-center rounded-md border border-ink/25 px-5 font-semibold hover:border-ink">
                Read the explainers
              </Link>
            </div>
          </div>

          <div className="mt-10">
            <TransferSpecimen />
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-8 border-t border-rule bg-sheet">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">The life of a transfer</h2>
            <p className="mt-4 max-w-[62ch] text-lg text-muted">
              Six steps, from enrolling a customer to letting an auditor re-check the decision long afterwards. Each
              step leaves evidence the next one can verify.
            </p>
            <ol className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {LIFECYCLE.map((step, index) => (
                <li key={step.title} className="border-t-2 border-ink pt-4">
                  <p className="text-sm font-semibold text-seal">Step {index + 1}</p>
                  <h3 className="mt-1 text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 max-w-[48ch] text-muted">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-rule">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What a valid proof does not tell you</h2>
              <p className="mt-4 max-w-[46ch] text-lg text-muted">
                A proof is precise about a narrow statement. Knowing its edges is how you use it well.
              </p>
            </div>
            <dl className="divide-y divide-rule border-y border-rule">
              {LIMITS.map((limit) => (
                <div key={limit.title} className="py-5">
                  <dt className="text-lg font-semibold">{limit.title}</dt>
                  <dd className="mt-1 max-w-[62ch] text-muted">{limit.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-t border-rule bg-ink text-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Run the pilot yourself</h2>
              <p className="mt-4 max-w-[46ch] text-lg text-white/75">
                Build from source, then follow the local acceptance guide. It generates development keys, starts a
                throwaway database and test chain, and takes a synthetic transfer through every step above with
                real proofs.
              </p>
              <Link
                href={`${REPO}/blob/main/docs/operations/local-pilot-acceptance.md`}
                className="mt-6 inline-block font-semibold underline decoration-white/40 underline-offset-4 hover:decoration-white"
              >
                Open the local acceptance guide
              </Link>
            </div>
            <div className="min-w-0">
              <pre className="overflow-x-auto rounded-md bg-black/35 p-5 font-mono text-sm leading-relaxed text-white/90">
                <code>{SETUP}</code>
              </pre>
              <p className="mt-3 text-sm text-white/60">
                Needs Node, Python 3.12 with uv, Circom 2.2.2 and PostgreSQL 18. Use synthetic data only.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-rule">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Learn how it works</h2>
              <p className="mt-4 max-w-[46ch] text-lg text-muted">
                Short, source-checked explainers. Each links to the code and specs it describes.
              </p>
              <Link href={`${DOCS}/feed.xml`} className="mt-6 inline-block font-semibold text-seal underline underline-offset-4">
                Follow updates by RSS
              </Link>
            </div>
            <ul className="divide-y divide-rule border-y border-rule">
              {EXPLAINERS.map((item) => (
                <li key={item.slug}>
                  <Link href={`${DOCS}/explainers/${item.slug}`} className="group flex items-baseline justify-between gap-6 py-4 text-lg font-medium">
                    <span className="group-hover:text-seal">{item.title}</span>
                    <span aria-hidden="true" className="shrink-0 text-muted group-hover:text-seal">Read</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="status" className="border-t border-rule bg-sheet">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Where the project stands</h2>
              <p className="mt-4 max-w-[46ch] text-lg text-muted">Checked September 25, 2026.</p>
            </div>
            <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-[9rem_1fr]">
              {STATUS.map((item) => (
                <div key={item.term} className="contents">
                  <dt className="font-semibold">{item.term}</dt>
                  <dd className="max-w-[62ch] text-muted">{item.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-[15px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>Clearproof is open source under Apache-2.0.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            <li><Link href={REPO} className="hover:text-ink">GitHub</Link></li>
            <li><Link href={DOCS} className="hover:text-ink">Docs</Link></li>
            <li><Link href={`${DOCS}/docs/contracts`} className="hover:text-ink">Testnet contracts</Link></li>
            <li><Link href={`${DOCS}/feed.xml`} className="hover:text-ink">RSS</Link></li>
          </ul>
        </div>
      </footer>
    </>
  );
}
