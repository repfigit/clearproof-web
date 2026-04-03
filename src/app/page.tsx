import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const CONTRACTS = [
  {
    name: "Groth16Verifier",
    address: "0xD2E419C913F2f3aA661DB422A295026F5A1CB71c",
    purpose: "ZK proof verification",
  },
  {
    name: "VASPRegistry",
    address: "0xa8aB6DBA49307617945a46b4Ae4A27d922AE5962",
    purpose: "VASP identity + discovery",
  },
  {
    name: "SanctionsOracle",
    address: "0xFf14ef1021D081DD2A536a2cf8066F5334340919",
    purpose: "Sanctions Merkle root",
  },
  {
    name: "ComplianceRegistry",
    address: "0x4B889625d263fdD17F609c137ca9ea5463350d75",
    purpose: "Domain-bound proof recording",
  },
  {
    name: "SanctionsRootRelay",
    address: "0x1e808E9739f24b80bEb379B1a88e4152eB41635A",
    purpose: "Oracle update adapter",
  },
];

const SIGNALS = [
  { idx: "0", name: "is_compliant", desc: "All checks pass" },
  { idx: "1", name: "sar_review_flag", desc: "Tier >= 3 (advisory)" },
  { idx: "2", name: "sanctions_tree_root", desc: "OFAC/UN/EU root" },
  { idx: "3", name: "issuer_tree_root", desc: "Trusted issuer root" },
  { idx: "4", name: "amount_tier", desc: "1-4 (not exact amount)" },
  { idx: "5", name: "transfer_timestamp", desc: "Unix epoch" },
  { idx: "6", name: "jurisdiction_code", desc: "ISO 3166" },
  { idx: "7", name: "credential_commitment", desc: "Poseidon hash" },
  { idx: "8-10", name: "tier thresholds", desc: "Jurisdiction boundaries" },
  { idx: "11", name: "domain_chain_id", desc: "Chain binding" },
  { idx: "12", name: "domain_contract_hash", desc: "Contract binding" },
  { idx: "13", name: "transfer_id_hash", desc: "Transfer binding" },
  { idx: "14", name: "credential_nullifier", desc: "One-time use" },
  { idx: "15", name: "proof_expires_at", desc: "TTL enforcement" },
];

const PACKAGES = [
  {
    name: "@clearproof/circuits",
    version: "0.2.0",
    desc: "Circom circuits + pre-compiled artifacts",
    href: "https://www.npmjs.com/package/@clearproof/circuits",
  },
  {
    name: "@clearproof/proof",
    version: "0.1.0",
    desc: "TypeScript SDK for proof generation",
    href: "https://www.npmjs.com/package/@clearproof/proof",
  },
  {
    name: "@clearproof/cli",
    version: "0.1.0",
    desc: "CLI with 60-second demo",
    href: "https://www.npmjs.com/package/@clearproof/cli",
  },
  {
    name: "@clearproof/contracts",
    version: "0.1.0",
    desc: "Solidity contracts + ABIs",
    href: "https://www.npmjs.com/package/@clearproof/contracts",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <img src="/logo.png" alt="" width={28} height={28} />
            <span>clear<span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">proof</span></span>
          </Link>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link href="https://docs.clearproof.world" className="hover:text-foreground transition-colors">Docs</Link>
            <Link href="https://github.com/repfigit/clearproof" className="hover:text-foreground transition-colors">GitHub</Link>
            <Link href="https://www.npmjs.com/org/clearproof" className="hover:text-foreground transition-colors">npm</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/50 via-background to-background" />
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-24 text-center">
          <Badge variant="secondary" className="mb-6 font-mono text-xs">
            v0.2.0 on Sepolia testnet
          </Badge>
          <h1 className="flex items-center justify-center gap-3 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <img src="/logo.png" alt="clearproof" width={64} height={64} className="sm:w-16 sm:h-16 lg:w-20 lg:h-20" />
            <span>clear<span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">proof</span></span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            ZK infrastructure for compliant value transfer. Prove sanctions
            clearance, credential validity, and jurisdiction-correct tier
            encoding — without revealing private data.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="https://docs.clearproof.world"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              Documentation
            </Link>
            <Link
              href="https://github.com/repfigit/clearproof"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-secondary px-6 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              GitHub
            </Link>
            <Link
              href="https://www.npmjs.com/org/clearproof"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted"
            >
              npm
            </Link>
            <Link
              href="https://sepolia.etherscan.io/address/0x4B889625d263fdD17F609c137ca9ea5463350d75#code"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted"
            >
              Etherscan
            </Link>
          </div>
          <div className="mx-auto mt-12 max-w-xl rounded-lg border bg-card p-4 text-left font-mono text-sm text-muted-foreground">
            <p className="text-foreground">$ npm install @clearproof/circuits @clearproof/proof snarkjs</p>
            <p className="mt-1 text-green-400">+ @clearproof/circuits@0.2.0</p>
            <p className="text-green-400">+ @clearproof/proof@0.1.0</p>
          </div>
        </div>
      </section>

      <Separator />

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          The originating VASP generates a ZK proof locally. The proof attests
          that compliance was performed correctly. Encrypted PII travels
          alongside. The beneficiary verifies the proof on-chain or off-chain
          in under 50ms.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <p className="font-mono text-sm text-muted-foreground">01</p>
              <h3 className="mt-2 text-lg font-semibold">Prove</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Generate a Groth16 proof in 562ms. Sanctions non-membership,
                credential validity, amount tier — all verified in a single
                proof with 15,819 constraints.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="font-mono text-sm text-muted-foreground">02</p>
              <h3 className="mt-2 text-lg font-semibold">Transmit</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Send the hybrid payload via TRISA, TRP, or TAIP-10. ZK proof +
                encrypted PII satisfies the regulatory &ldquo;transmit&rdquo;
                requirement with minimal data exposure.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="font-mono text-sm text-muted-foreground">03</p>
              <h3 className="mt-2 text-lg font-semibold">Verify</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Verify on-chain (290k gas) or off-chain (&lt;50ms). Domain
                binding prevents cross-chain replay. Nullifiers prevent proof
                reuse. Proof expiration enforced on-chain.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Public Signals */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">16 public signals</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Everything the verifier needs. Nothing the verifier shouldn&apos;t see.
          Private data stays with the prover.
        </p>
        <div className="mt-8 overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-mono text-xs text-muted-foreground">Idx</th>
                <th className="px-4 py-3 text-left font-mono text-xs text-muted-foreground">Signal</th>
                <th className="px-4 py-3 text-left text-xs text-muted-foreground">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {SIGNALS.map((s) => (
                <tr key={s.idx} className="border-b last:border-0">
                  <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{s.idx}</td>
                  <td className="px-4 py-2 font-mono text-xs">{s.name}</td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">{s.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Separator />

      {/* Contracts */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight">Contracts</h2>
          <Badge variant="outline" className="font-mono text-xs">Sepolia</Badge>
        </div>
        <p className="mt-3 text-muted-foreground">
          All contracts are verified on Etherscan. Source code is readable on-chain.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {CONTRACTS.map((c) => (
            <Card key={c.name}>
              <CardContent className="pt-6">
                <h3 className="font-semibold">{c.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.purpose}</p>
                <Link
                  href={`https://sepolia.etherscan.io/address/${c.address}#code`}
                  className="mt-3 inline-block font-mono text-xs text-muted-foreground hover:text-foreground transition-colors break-all"
                >
                  {c.address}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Packages */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">Packages</h2>
        <p className="mt-3 text-muted-foreground">
          Install from npm. Use the circuits in your own project, or generate proofs with the TypeScript SDK.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {PACKAGES.map((p) => (
            <Link key={p.name} href={p.href} className="group">
              <Card className="transition-colors group-hover:border-foreground/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{p.name}</span>
                    <Badge variant="secondary" className="font-mono text-xs">{p.version}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <Separator />

      {/* Security */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">Security properties</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Domain binding", desc: "Proofs are bound to a specific chain ID and contract address. Cross-chain replay is impossible." },
            { title: "Nullifiers", desc: "Each credential + transfer pair produces a unique nullifier. Proof reuse is prevented on-chain." },
            { title: "State binding", desc: "Proof must match the current sanctions root and issuer root at verification time." },
            { title: "Proof expiration", desc: "proof_expires_at is enforced on-chain via block.timestamp. Stale proofs are rejected." },
            { title: "VASP binding", desc: "Only the registered VASP wallet (msg.sender) can submit proofs for its DID." },
            { title: "Credential revocation", desc: "Revoked credential commitments are checked on-chain before proof acceptance." },
          ].map((s) => (
            <Card key={s.title}>
              <CardContent className="pt-6">
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Quick start */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">Quick start</h2>
        <div className="mt-8 space-y-6">
          <div className="rounded-lg border bg-card p-6 font-mono text-sm">
            <p className="text-muted-foreground"># Install</p>
            <p>npm install @clearproof/circuits @clearproof/proof snarkjs</p>
            <br />
            <p className="text-muted-foreground"># Generate a proof (TypeScript)</p>
            <p>{`import { generateProof } from '@clearproof/proof';`}</p>
            <p>{`import { artifacts } from '@clearproof/circuits';`}</p>
            <br />
            <p>{`const { proof, publicSignals } = await generateProof(`}</p>
            <p>{`  input, artifacts.wasmPath, artifacts.zkeyPath`}</p>
            <p>{`);`}</p>
            <br />
            <p className="text-muted-foreground"># Or run the 60-second demo</p>
            <p>npx @clearproof/cli demo</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="mx-auto max-w-5xl px-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Apache-2.0 License
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="https://docs.clearproof.world" className="hover:text-foreground transition-colors">
              Docs
            </Link>
            <Link href="https://github.com/repfigit/clearproof" className="hover:text-foreground transition-colors">
              GitHub
            </Link>
            <Link href="https://www.npmjs.com/org/clearproof" className="hover:text-foreground transition-colors">
              npm
            </Link>
            <Link href="https://sepolia.etherscan.io/address/0x4B889625d263fdD17F609c137ca9ea5463350d75#code" className="hover:text-foreground transition-colors">
              Etherscan
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
