"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

// Synthetic sample transfer. No real person or account.
const FIELDS = [
  { label: "Originator", value: "Ana María Ruiz" },
  { label: "Date of birth", value: "14 March 1987" },
  { label: "Address", value: "Calle de Alcalá 48, 28014 Madrid" },
  { label: "National ID", value: "X-4471903-K" },
  { label: "Sending wallet", value: "0x5b3f…a91c" },
  { label: "Beneficiary", value: "Jonas Keller" },
  { label: "Receiving wallet", value: "0x9e07…44d2" },
  { label: "Amount", value: "12,480.00 USDC" },
];

const FACTS = [
  "The sender holds a valid, unexpired credential from an authorized issuer.",
  "Neither wallet is on the sanctions list the verifier trusts.",
  "The amount was valued exactly and tiered against the active policy.",
  "The proof belongs to this transfer on this chain and registry.",
  "It can authorize the transfer once, and it expires within five minutes.",
];

// How long each view stays on screen during autoplay.
const DWELL_MS = { plain: 3500, sealed: 8000 } as const;

// Decorative ciphertext: deterministic hex derived from each value, so it is stable across renders.
function cipherFor(text: string) {
  // FNV-1a over the whole value first, then a xorshift stream, so values never share a prefix.
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619) >>> 0;
  let out = "";
  while (out.length < text.length * 2) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    h >>>= 0;
    out += h.toString(16).padStart(8, "0");
  }
  return out.slice(0, text.length * 2);
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCED_MOTION);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true, // Server render: no autoplay until the client says otherwise.
  );
}

type View = "plain" | "sealed";

export function TransferSpecimen() {
  const [view, setView] = useState<View>("plain");
  const [autoplay, setAutoplay] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);
  const [runId, setRunId] = useState(0);
  const [announce, setAnnounce] = useState(false);
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const sealed = view === "sealed";

  const playing = autoplay && !userPaused && !hovering && inView && !reducedMotion;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.5 });
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      setView((current) => (current === "plain" ? "sealed" : "plain"));
      setRunId((id) => id + 1);
    }, DWELL_MS[view]);
    return () => clearTimeout(timer);
  }, [playing, view, runId]);

  // Restart the progress bar (and the dwell timer) whenever playback resumes.
  const resume = useCallback(() => setRunId((id) => id + 1), []);

  const choose = (next: View) => {
    setAutoplay(false);
    setAnnounce(true);
    setView(next);
  };

  const target: View = sealed ? "plain" : "sealed";

  return (
    <div
      ref={cardRef}
      data-sealed={sealed}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        resume();
      }}
      onFocus={() => setHovering(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setHovering(false);
          resume();
        }
      }}
      className="relative rounded-xl border border-white/10 bg-card/70 shadow-[0_0_80px_-20px_oklch(0.55_0.2_265/0.55)] backdrop-blur"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
        <p className="text-sm text-muted-foreground">
          The same transfer, sent two ways. Watch it switch, or choose a view.
        </p>
        <div className="flex items-center gap-2">
          <div role="group" aria-label="How the transfer is sent" className="flex rounded-full border border-white/10 bg-background/60 p-0.5 text-sm">
            {(
              [
                ["plain", "Plain message"],
                ["sealed", "With clearproof"],
              ] as const
            ).map(([value, label]) => {
              const active = view === value;
              const next = autoplay && value === target;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => choose(value)}
                  className={`relative overflow-hidden rounded-full px-4 py-1.5 font-medium transition-colors ${
                    active
                      ? "bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-[0_0_18px_-4px_#22d3ee]"
                      : "text-muted-foreground hover:text-foreground"
                  } ${next && value === "sealed" ? "attention text-foreground" : ""}`}
                >
                  {label}
                  {next && playing && (
                    <span
                      key={runId}
                      aria-hidden="true"
                      className="autoplay-progress"
                      style={{ "--dwell": `${DWELL_MS[view]}ms` } as React.CSSProperties}
                    />
                  )}
                </button>
              );
            })}
          </div>
          {autoplay && !reducedMotion && (
            <button
              type="button"
              onClick={() => {
                setUserPaused((paused) => !paused);
                resume();
              }}
              aria-label={userPaused ? "Play the demo" : "Pause the demo"}
              className="grid size-8 place-items-center rounded-full border border-white/10 text-muted-foreground hover:text-foreground"
            >
              {userPaused ? (
                <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
                  <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
                  <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-[1.05fr_1fr]">
        <dl className="grid grid-cols-[8.5rem_1fr] gap-x-4 gap-y-3 px-5 py-6 text-[15px] md:border-r md:border-white/10">
          {FIELDS.map((field, index) => (
            <div key={field.label} className="contents">
              <dt className="text-muted-foreground">{field.label}</dt>
              <dd>
                <span className="field-value" style={{ "--delay": `${index * 45}ms` } as React.CSSProperties}>
                  <span className="field-text">{field.value}</span>
                  <span className="cipher" aria-hidden="true">
                    {cipherFor(field.value)}
                  </span>
                </span>
                {sealed && <span className="sr-only"> (encrypted)</span>}
              </dd>
            </div>
          ))}
        </dl>

        {/* Announce only views the visitor chose, not automatic switches. */}
        <div className="border-t border-white/10 px-5 py-6 md:border-t-0" aria-live={announce ? "polite" : "off"}>
          {sealed ? (
            <>
              <h3 className="font-semibold">What anyone checking the proof learns</h3>
              <ul className="mt-4 space-y-3">
                {FACTS.map((fact, index) => (
                  <li
                    key={fact}
                    className="fact flex gap-3 text-[15px]"
                    style={{ "--delay": `${420 + index * 70}ms` } as React.CSSProperties}
                  >
                    <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0 text-cyan-400 drop-shadow-[0_0_6px_#22d3ee]">
                      <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M6 10.3l2.6 2.6L14 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-white/10 pt-4 text-sm text-muted-foreground">
                The personal details still reach the receiving institution, encrypted to its key. Nobody else
                along the way can read them.
              </p>
            </>
          ) : (
            <>
              <h3 className="font-semibold">Where this ends up</h3>
              <p className="mt-4 text-[15px] text-foreground/90">
                Once decrypted, the full record sits in plain form in every system that processes, logs or
                stores it: compliance tools, support queues, analytics exports and backups on both sides.
              </p>
              <p className="mt-3 text-[15px] text-foreground/90">
                Each copy is another place a customer&rsquo;s identity can leak, and the receiving side still has
                to take the sender&rsquo;s word that screening happened.
              </p>
              <p className="mt-5 border-t border-white/10 pt-4 text-sm text-muted-foreground">
                Switch to <strong className="font-semibold text-foreground">With clearproof</strong> to see the same
                transfer sent as a proof plus an encrypted envelope.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
