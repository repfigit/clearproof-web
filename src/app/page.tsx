import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

const CONTRACTS = [
  { name: "Groth16Verifier", address: "0x6F8e6f64C5601Eb25716f45C78c9B7C9c0bde8EA", purpose: "Cryptographic proof verification" },
  { name: "VASPRegistry", address: "0x99FE2813FD9D66Df43d1ce37d39341F5A7a557F0", purpose: "VASP registration and issuer roots" },
  { name: "SanctionsOracle", address: "0x2822db7e67E1152a9cC81E44Df2182CA4662c7a2", purpose: "Sanctions root publication and freshness" },
  { name: "ComplianceRegistry", address: "0x941F7f188843279C03D1960821B4332A40e806F7", purpose: "Domain-bound proof acceptance and records" },
  { name: "SanctionsRootRelay", address: "0x911d8244F3b63a40040862dB0CC285A753036F87", purpose: "Sanctions root relay adapter" },
];

const PACKAGES = [
  { name: "@clearproof/proof", desc: "TypeScript proof generation and verification SDK." },
  { name: "@clearproof/circuits", desc: "Circuit package. Check artifact availability before attempting proof generation." },
  { name: "@clearproof/cli", desc: "Published, but public installation currently fails because its @clearproof/content dependency is unavailable on npm. Source builds require repository access." },
  { name: "@clearproof/contracts", desc: "Solidity contracts and integration artifacts for EVM development." },
];

const ROADMAP = [
  { title: "Trustworthy evidence", desc: "Strengthen credential and transfer binding, tenant isolation, verification consistency and recipient key handling." },
  { title: "Policy comparison", desc: "Explain how a proposed policy changes transfer decisions and manual-review work." },
  { title: "Transfer investigations", desc: "Join compliance, counterparty, proof and settlement events into an investigation timeline." },
  { title: "Historical verification", desc: "Export evidence that an independent reviewer can assess after the original proof expires." },
  { title: "Observation onboarding", desc: "Compare results alongside an existing workflow, using controlled data and simulated counterparties." },
  { title: "Credential interoperability", desc: "Add a supported issuer and wallet profile when a design partner needs it." },
];

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
            <Link href="#status" className="hover:text-foreground">Status</Link>
            <Link href="https://docs.clearproof.world" className="hover:text-foreground">Docs</Link>
            <Link href="#packages" className="hover:text-foreground">Packages</Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/50 via-background to-background" />
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-24 text-center">
          <Badge variant="secondary" className="mb-6 text-xs">Pilot-stage software · Sepolia testnet</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Privacy-focused evidence<br className="hidden sm:block" /> for crypto transfers.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Explore zero-knowledge checks and encrypted transfer information with clearproof.
            Built for teams evaluating how to verify specific facts while limiting the spread of customer data.
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground">
            Development software for controlled evaluation. Circuits and contracts have not completed independent audits;
            current proving artifacts use a development-only trusted setup.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="https://docs.clearproof.world" className="inline-flex h-11 items-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/80">Read the documentation</Link>
            <Link href="#status" className="inline-flex h-11 items-center rounded-lg border px-6 text-sm font-medium hover:bg-muted">Review project status</Link>
          </div>
          <p className="mt-8 text-xs text-muted-foreground">Repository and package status checked September 6, 2026</p>
        </div>
      </section>

      <Separator />

      <section id="status" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">What you can evaluate today</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          The project includes Circom/Groth16 circuits, a TypeScript SDK, CLI tools, a Python API,
          encrypted payload components and EVM contracts. These components are a foundation for a pilot.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            { title: "Specific proof checks", desc: "Circuits model sanctions non-membership, credential checks and amount tiers. A proof establishes its encoded statement; authentic inputs, holder authority and the surrounding policy still require verification." },
            { title: "Encrypted information", desc: "Hybrid payload components carry a proof alongside encrypted personal information. Authorized recipients still receive required information. Key discovery, rotation and operational controls need integration validation." },
            { title: "Protocol prototypes", desc: "TRP, TRISA and TAIP-10 bridge components exist. Complete bilateral interoperability and provider-specific workflows remain to be demonstrated." },
            { title: "Verification boundaries", desc: "The registry adds state, domain, expiry and replay checks to cryptographic verification. Full equivalence between API, SDK and registry acceptance remains open." },
          ].map((item) => (
            <Card key={item.title}><CardContent className="pt-6">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </CardContent></Card>
          ))}
        </div>
        <div className="mt-8 rounded-lg border p-6 text-sm text-muted-foreground">
          <p><strong className="text-foreground">Source availability:</strong> the main GitHub repository, <span className="break-all font-mono">repfigit/clearproof</span>, is currently private. Public npm packages and documentation are available.</p>
          <p className="mt-3"><strong className="text-foreground">Versions:</strong> published npm packages are at 0.3.0; the development checkout is 0.4.0. Features in development may not be available in the published packages.</p>
          <p className="mt-3"><strong className="text-foreground">Installation:</strong> the public proof SDK installs successfully. The published CLI currently has an unavailable dependency; use an authorized source checkout for CLI evaluation.</p>
          <p className="mt-3"><strong className="text-foreground">Assurance:</strong> no completed independent circuit or contract audit, production trusted setup, or end-to-end regulatory compliance certification is claimed. Use synthetic data and testnet funds for evaluation.</p>
        </div>
      </section>

      <Separator />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">The intended transfer workflow</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A virtual asset service provider (VASP), such as an exchange or custodian, combines checks,
          protected information exchange and a scoped verification decision.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { step: "01", title: "Evaluate", desc: "Use authenticated credential and screening inputs to evaluate the required policy. Generate a proof for the predicates supported by the chosen circuit." },
            { step: "02", title: "Exchange", desc: "Encrypt required personal information for an authorized recipient and exchange it through a compatible, tested protocol integration." },
            { step: "03", title: "Verify and record", desc: "Check the proof, trusted state, transfer context and freshness. Record what was checked and distinguish acceptance from successful settlement." },
          ].map((item) => (
            <Card key={item.step}><CardContent className="pt-6">
              <p className="font-mono text-sm text-muted-foreground">{item.step}</p>
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </CardContent></Card>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          A zero-knowledge proof and encrypted payload do not by themselves establish legal compliance.
          Required information, trusted counterparties, screening, retention and applicable rules depend on the deployment.
          Public proof metadata can also reveal information; the design does not promise complete anonymity.
        </p>
      </section>

      <Separator />

      <section id="roadmap" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight">What we’re building next</h2>
          <Badge variant="outline">In development · Unreleased</Badge>
        </div>
        <p className="mt-3 max-w-2xl text-muted-foreground">The next pilot focuses on trustworthy evidence and recurring operational work for a stablecoin processor or custodian. Development is underway; these capabilities are not generally available.</p>
        <div className="mt-6 rounded-lg border p-6 text-sm text-muted-foreground">
          <h3 className="font-semibold text-foreground">Latest development progress</h3>
          <p className="mt-3">An open draft change adds wallet-signed credential enrollment, revocation records, encrypted storage scoped to each tenant, signed issuer roots and a contract for recording approved roots. Transfer checks bind participant, asset, valuation, policy and timing fields to a commitment.</p>
          <p className="mt-3">The draft also adds development proof generation and cryptographic verification, signed valuation inputs, and policy evaluation that explains allow, review, deny or indeterminate outcomes. Policy comparison reports show how proposed rules change decisions using supplied or retained evidence. Policy review and activation are separate operations, with retained activation history and explicit rollback to a reviewed, effective version.</p>
          <p className="mt-3">Current proof inspection checks retained credential revocation and approved roots. Signed external facts can be retained encrypted and checked again for scope, trust and freshness during policy evaluation. These services do not authorize transfers; integrating the active policy selection into the complete authorization workflow remains in progress.</p>
          <p className="mt-3">Transfer investigation tools combine compliance, proof, counterparty, custody, chain and evidence observations into timelines and paginated queues. Reports identify conflicts and unresolved steps with suggested owners and next actions. Access is authenticated and scoped to each tenant; reports do not authorize transfers.</p>
          <p className="mt-3">A Fireblocks webhook adapter verifies a supported signature and event profile and retains encrypted source evidence through an authenticated relay. Validation uses synthetic signed events and a local database. Live provider interoperability and automatic signing-key refresh remain unvalidated or unimplemented.</p>
          <p className="mt-3">Local database, proof, CLI/API and test-chain checks cover these components. A complete integrated proof workflow, consistent acceptance across the API, SDK and contracts, portable historical verification, and independent security review remain open. This work is not included in the published 0.3.0 packages or the Sepolia deployments listed below.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROADMAP.map((item) => (
            <Card key={item.title}><CardContent className="pt-6">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </CardContent></Card>
          ))}
        </div>
      </section>

      <Separator />

      <section id="packages" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">Published packages</h2>
        <p className="mt-3 text-muted-foreground">Version 0.3.0 is available on npm for each package below, checked September 6, 2026. Review each package’s contents and requirements before integrating.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {PACKAGES.map((item) => (
            <Link key={item.name} href={`https://www.npmjs.com/package/${item.name}`} className="group">
              <Card className="h-full transition-colors group-hover:border-foreground/20"><CardContent className="pt-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="break-all font-mono text-sm">{item.name}</span>
                  <Badge variant="secondary" className="font-mono text-xs">0.3.0</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </CardContent></Card>
            </Link>
          ))}
        </div>
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Start with the SDK</h3>
          <pre className="mt-4 overflow-x-auto text-sm"><code>npm install @clearproof/proof@0.3.0</code></pre>
          <p className="mt-4 text-sm text-muted-foreground">Proof generation also requires compatible circuit WASM and proving-key files; verification requires the matching verification key. The package installation alone is not a complete proving setup.</p>
          <Link href="https://docs.clearproof.world/docs/quickstart" className="mt-4 inline-block text-sm underline underline-offset-4">Read setup requirements</Link>
        </div>
      </section>

      <Separator />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight">Recorded testnet deployments</h2>
          <Badge variant="outline">Sepolia only</Badge>
        </div>
        <p className="mt-3 max-w-2xl text-muted-foreground">Addresses from the July 20, 2026 deployment record. Contract bytecode was checked on Sepolia on September 5, 2026. These are historical test deployments; code presence does not establish that they match the current development checkout. Deployment and explorer listings do not establish an independent security audit.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {CONTRACTS.map((item) => (
            <Card key={item.name}><CardContent className="pt-6">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.purpose}</p>
              <Link href={`https://sepolia.etherscan.io/address/${item.address}#code`} className="mt-3 inline-block break-all font-mono text-xs text-muted-foreground hover:text-foreground">{item.address}</Link>
            </CardContent></Card>
          ))}
        </div>
      </section>

      <footer className="border-t py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">clearproof · Controlled evaluation, September 2026</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#status" className="hover:text-foreground">Project status</Link>
            <Link href="https://docs.clearproof.world" className="hover:text-foreground">Docs</Link>
            <Link href="https://www.npmjs.com/org/clearproof" className="hover:text-foreground">npm</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
