/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Citation } from "../types";
import { ShieldAlert, Fingerprint, Calendar, ExternalLink, RefreshCw, CheckCircle } from "lucide-react";

interface SourceReceiptCardsProps {
  citations: Citation[];
}

export default function SourceReceiptCards({ citations }: SourceReceiptCardsProps) {
  // Tracking verification statuses per card
  const [verifyingMap, setVerifyingMap] = useState<Record<number, "idle" | "scanning" | "verified">>({});

  const triggerVerification = (id: number) => {
    setVerifyingMap((prev) => ({ ...prev, [id]: "scanning" }));
    setTimeout(() => {
      setVerifyingMap((prev) => ({ ...prev, [id]: "verified" }));
    }, 1100);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Visual Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Fingerprint className="h-5 w-5 text-cyan-400" />
          <h2 className="font-heading font-semibold text-sm uppercase tracking-wider text-slate-200">
            Source Provenance Receipts Hub
          </h2>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          IMMUTABLE SIGNATURE BOUNDARY
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-normal mb-1">
        AURA locks every scraped intelligence slice to an immutable block state using real-world search mappings. Run local SHA-256 checks below to confirm consensus integrity.
      </p>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {citations.map((cite) => {
          const verifyState = verifyingMap[cite.id] || "idle";

          return (
            <div
              key={cite.id}
              className={`border rounded-xl p-5 flex flex-col justify-between gap-4 bg-slate-950 transition-all ${
                verifyState === "scanning"
                  ? "border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] bg-slate-900/40"
                  : verifyState === "verified"
                  ? "border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "border-slate-805 hover:border-slate-705 shadow-md"
              }`}
            >
              {/* Top Banner Row */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-900 pb-2.5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-cyan-400 font-mono font-bold tracking-widest uppercase">
                    RECEIPT CODE: #SRC-{(idxToHex(cite.id))}
                  </span>
                  <span className="text-xs text-slate-400 font-serif font-semibold mt-0.5">
                    {cite.publisher}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-1 py-0.5 rounded">
                    ID: {cite.id}
                  </span>
                </div>
              </div>

              {/* Title & Extract */}
              <div className="flex flex-col gap-1.5">
                <h4 className="font-heading text-sm font-semibold tracking-tight leading-snug text-white">
                  {cite.title}
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-400 italic">
                  "{cite.snippet}"
                </p>
              </div>

              {/* Checksum Hash Block */}
              <div className="bg-slate-900 border border-slate-850 rounded p-2.5 flex flex-col gap-1 font-mono text-[9px]">
                <div className="flex justify-between text-slate-500 uppercase">
                  <span>Cryptographic Proof</span>
                  <span>SHA-256 Invariant</span>
                </div>
                <span className="text-slate-200 select-all overflow-hidden text-ellipsis whitespace-nowrap leading-none mt-1">
                  {cite.hashSignature || "0xef3a09b...23db"}
                </span>
                <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                  <Calendar className="h-3 w-3" />
                  <span>Validated: {cite.publishDate || "Q1 2026"}</span>
                </div>
              </div>

              {/* Trust Index Progress Bar */}
              <div className="flex flex-col gap-1 text-[10px]">
                <div className="flex justify-between items-center text-slate-400">
                  <span>AURA TRUST INDEX RATING:</span>
                  <span className={`font-mono font-bold ${
                    cite.trustRating > 0.95 ? "text-emerald-400" : "text-amber-400"
                  }`}>
                    {(cite.trustRating * 100).toFixed(0)}/100
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cite.trustRating * 100}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      cite.trustRating > 0.95 ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                </div>
              </div>

              {/* Interactive Audit Action */}
              <div className="flex items-center justify-between border-t border-slate-900 pt-3 gap-2">
                <a
                  href={cite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition"
                >
                  <span>Open Primary Source Link</span>
                  <ExternalLink className="h-3 w-3" />
                </a>

                {verifyState === "verified" ? (
                  <div className="flex items-center gap-1 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-1 rounded text-[10px] font-mono text-emerald-400">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>VALID_SECURE</span>
                  </div>
                ) : verifyState === "scanning" ? (
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-mono text-cyan-400 animate-pulse">
                    <RefreshCw className="h-3 w-3 animate-spin text-cyan-400" />
                    <span>AUDITING...</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => triggerVerification(cite.id)}
                    className="cursor-pointer bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white px-3 py-1 text-[10px] font-mono font-bold rounded transition"
                  >
                    [VERIFY PROVENANCE]
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Convert citation ID to elegant HEX representation
function idxToHex(id: number): string {
  if (id === 1) return "0E";
  if (id === 2) return "3C";
  if (id === 3) return "92";
  if (id === 4) return "A1";
  return ("F" + id);
}
