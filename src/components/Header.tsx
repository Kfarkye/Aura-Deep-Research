/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface HeaderProps {
  currentDomain: string;
  isOnline: boolean;
  systemTime: string;
}

export default function Header({ currentDomain, isOnline, systemTime }: HeaderProps) {
  return (
    <header className="border-b border-slate-805 bg-white px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Pristine Minimalist Typography Branding */}
      <div className="flex items-center gap-3">
        <h1 className="font-heading font-medium text-lg tracking-tight text-slate-50">
          Aura
        </h1>
        <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase pl-3 border-l border-slate-805">
          Research Synthesis
        </span>
      </div>

      {/* Meta Indicators - Completely Uncluttered & Human */}
      <div className="flex items-center gap-6 text-xs text-slate-500 font-sans">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-600 uppercase">Domain:</span>
          <span className="text-slate-50 uppercase font-medium">{currentDomain || "General"}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-600 uppercase">Grounding:</span>
          <span className="text-slate-50 font-medium uppercase">
            {isOnline ? "Connected" : "Sandboxed"}
          </span>
        </div>

        {systemTime && (
          <div className="hidden md:block text-[10px] font-mono text-slate-600">
            {systemTime}
          </div>
        )}
      </div>
    </header>
  );
}
