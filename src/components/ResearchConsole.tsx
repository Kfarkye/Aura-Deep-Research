/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Loader2, BookOpen, Clock, AlertCircle } from "lucide-react";
import { AgentLog } from "../types";

interface ResearchConsoleProps {
  onStartResearch: (topic: string, domain: string, depth: string) => Promise<void>;
  isLoading: boolean;
  agentLogs: AgentLog[];
  hasApiKey: boolean;
}

export const PRESETS = [
  {
    topic: "AI-Native Sports Intelligence Pipelines & Micro-betting (2026)",
    domain: "sports",
    label: "🏀 Sports Intelligence"
  },
  {
    topic: "CRISPR Epigenetic Reprogramming & In-Vivo Multiplexed Targeting",
    domain: "biotech",
    label: "🧬 CRISPR Epigenetics"
  },
  {
    topic: "Self-Routing eVTOL Flight Lanes & Autonomous Micro-Transit Systems",
    domain: "aerospace",
    label: "🚁 Autonomous Aerospace"
  },
  {
    topic: "Hyper-personalized Generative UI & SDUI Protocols on the Web (2026)",
    domain: "software",
    label: "💻 Server-Driven UI"
  }
];

export default function ResearchConsole({ onStartResearch, isLoading, agentLogs, hasApiKey }: ResearchConsoleProps) {
  const [topic, setTopic] = useState("AI-Native Sports Intelligence Pipelines & Micro-betting (2026)");
  const [domain, setDomain] = useState("sports");
  const [depth, setDepth] = useState("deep");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onStartResearch(topic, domain, depth);
    }
  };

  return (
    <div className="bg-white border border-slate-805 rounded-xl p-6 flex flex-col gap-6">
      {/* Title */}
      <div className="border-b border-slate-805 pb-3">
        <h2 className="font-heading font-medium text-xs text-slate-50 uppercase tracking-widest">
          Research Objectives
        </h2>
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Topic Input */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider">
            Focus Query
          </label>
          <textarea
            id="research-topic-input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
            rows={3}
            className="w-full bg-slate-950 border border-slate-805 rounded-lg px-3.5 py-3 text-sm text-slate-50 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400 resize-y leading-relaxed font-sans"
            placeholder="Enter research objectives..."
          />
        </div>

        {/* Domain Selection Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider">
              Subject
            </label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              disabled={isLoading}
              className="w-full bg-slate-950 border border-slate-805 rounded-lg px-3 py-2.5 text-xs text-slate-50 focus:outline-none font-sans"
            >
              <option value="sports">Sports Intelligence</option>
              <option value="biotech">Genome & Biomedicine</option>
              <option value="aerospace">Aerospace Controls</option>
              <option value="software">Generative Software</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider">
              Format
            </label>
            <div className="flex bg-slate-950 border border-slate-805 rounded-lg p-1 gap-1">
              <button
                type="button"
                onClick={() => setDepth("quick")}
                disabled={isLoading}
                className={`flex-1 text-[11px] font-medium py-1.5 rounded transition cursor-pointer ${
                  depth === "quick" ? "bg-white text-slate-50 shadow-sm border border-slate-805 font-medium" : "text-slate-500 hover:text-slate-50"
                }`}
              >
                Quick
              </button>
              <button
                type="button"
                onClick={() => setDepth("deep")}
                disabled={isLoading}
                className={`flex-1 text-[11px] font-semibold py-1.5 rounded transition cursor-pointer ${
                  depth === "deep" ? "bg-white text-slate-50 shadow-sm border border-slate-805 font-semibold" : "text-slate-500 hover:text-slate-50"
                }`}
              >
                Deep Synthesis
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="w-full bg-slate-50 hover:bg-slate-350 disabled:bg-slate-850 text-white disabled:text-slate-500 font-heading font-medium text-xs py-3.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition select-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>SYNTHESIZING DEEP REPORT...</span>
            </>
          ) : (
            <>
              <BookOpen className="h-4 w-4 text-white" />
              <span>Compile Synthesis</span>
            </>
          )}
        </button>
      </form>

      {/* Suggestion Prompts */}
      <div className="flex flex-col gap-2.5 border-t border-slate-850 pt-4">
        <label className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest">
          Preset Contexts
        </label>
        <div className="flex flex-col gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => {
                setTopic(p.topic);
                setDomain(p.domain);
              }}
              className="text-left w-full bg-slate-950 hover:bg-slate-900 border border-slate-805 rounded-lg px-3.5 py-3 text-xs text-slate-50 transition flex items-center justify-between cursor-pointer group"
            >
              <span className="truncate pr-4 font-sans font-medium">{p.label.split(" ").slice(1).join(" ")}</span>
              <span className="text-[10px] text-slate-500 font-mono group-hover:text-slate-50 shrink-0">
                Load
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Secret Warn Alert (If using simulated bypass) */}
      {!hasApiKey && (
        <div className="bg-slate-950 border border-slate-805 rounded-lg p-3 flex gap-3 items-start mt-1">
          <AlertCircle className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 leading-relaxed font-sans">
            <strong>Simulation Sandbox:</strong> Sourcing index context dynamically using local analytical representations.
          </div>
        </div>
      )}

      {/* Dynamic Agent Workflow Logs Container */}
      <div className="bg-slate-950 border border-slate-805 rounded-lg p-4 flex flex-col gap-3 max-h-[175px] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-850 pb-2">
          <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            Verification Steps
          </span>
          <span className="text-[9px] font-mono text-slate-500 font-semibold uppercase">
            {isLoading ? "Active" : "Ready"}
          </span>
        </div>
        
        {agentLogs.length === 0 ? (
          <p className="text-xs text-slate-500 italic text-center py-4">
            Awaiting query initiation...
          </p>
        ) : (
          <div className="flex flex-col gap-2.5 font-sans text-xs">
            {agentLogs.map((log) => (
              <div key={log.id} className="flex flex-col gap-1 border-b border-slate-850/20 pb-2 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-50 text-[11px]">
                    {log.agentName}
                  </span>
                  <span className="text-slate-500 text-[10px] font-mono">{log.timestamp}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-slate-500 leading-normal text-[11px]">{log.action}</span>
                  <span className="text-[10px] font-mono font-medium text-slate-50 uppercase tracking-widest pl-2 font-semibold">
                    {log.status === "success" ? "✓ Done" : "Wait"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
