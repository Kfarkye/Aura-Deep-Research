/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Citation } from "../types";
import { FileText, ExternalLink, Download, CheckCircle } from "lucide-react";

interface ReportViewerProps {
  topic: string;
  reportMarkdown: string;
  executiveSummary: string;
  citations: Citation[];
}

export default function ReportViewer({ topic, reportMarkdown, executiveSummary, citations }: ReportViewerProps) {
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  const handleDownloadMarkdown = () => {
    const header = `---
Aura Deep Research Synthesis
TOPIC: ${topic}
GENERATED: ${new Date().toISOString()}
---

`;
    const blob = new Blob([header + reportMarkdown], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Research-${topic.toLowerCase().replace(/\s+/g, "-")}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-slate-805 rounded-xl p-8 flex flex-col gap-6 relative shadow-sm">
      {/* Upper Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-805 pb-5 gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-slate-950 border border-slate-805 rounded-lg flex items-center justify-center text-slate-50">
            <FileText className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-slate-100 text-sm">
              Document Synthesis
            </h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none mt-1">
              PEER GRADE EVALUATION: A
            </p>
          </div>
        </div>

        {/* Save/Export button */}
        <button
          onClick={handleDownloadMarkdown}
          className="flex items-center gap-1.5 self-start md:self-auto bg-slate-950 hover:bg-slate-900 text-white border border-slate-805 px-3.5 py-2 text-xs font-semibold rounded-lg cursor-pointer transition select-none"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Markdown (.md)</span>
        </button>
      </div>

      {/* Domain Header Display */}
      <div className="px-6 py-8 md:py-10 bg-slate-950 border border-slate-805 rounded-xl text-center relative overflow-hidden">
        <h2 className="font-serif text-2xl md:text-3.5xl text-slate-100 tracking-tight leading-normal max-w-2xl mx-auto font-medium">
          {topic}
        </h2>
        <div className="mt-4 flex justify-center gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
          <span>AURA SYNTHESIS ENGINE</span>
          <span>•</span>
          <span>GRADE A PROVENANCE</span>
        </div>
      </div>

      {/* Executive Digest Summary */}
      <div className="bg-slate-950 border border-slate-805 rounded-xl p-6 relative">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2.5 font-semibold">
          Executive Digest
        </span>
        <p className="text-sm text-slate-50 font-serif leading-relaxed italic">
          "{executiveSummary}"
        </p>
      </div>

      {/* Primary Synthesized Markdown Body */}
      <div className="research-markdown flex flex-col gap-3 px-1">
        <ReactMarkdown>{reportMarkdown}</ReactMarkdown>
      </div>

      {/* Floating Interactive Citation Tooltip */}
      {activeCitation && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-white border border-slate-805 rounded-xl p-4 shadow-xl animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between border-b border-slate-850/40 pb-2 mb-2">
            <span className="text-[9px] font-mono bg-slate-950 text-white px-2 py-0.5 rounded uppercase font-bold tracking-widest">
              Source Citation [{activeCitation.id}]
            </span>
            <button
              onClick={() => setActiveCitation(null)}
              className="text-slate-400 hover:text-slate-50 font-sans text-xs font-semibold"
            >
              ✕
            </button>
          </div>
          <h4 className="text-xs font-semibold text-slate-100 leading-snug mb-1">
            {activeCitation.title}
          </h4>
          <p className="text-[11px] text-slate-500 italic leading-relaxed mb-3">
            "{activeCitation.snippet}"
          </p>
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-600">
            <span>Score: {(activeCitation.trustRating * 100).toFixed(0)}/100 Trust</span>
            <a
              href={activeCitation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[007AFF] text-slate-50 font-semibold flex items-center gap-0.5 hover:underline"
            >
              Source Link <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>
      )}

      {/* Hover Index Footer */}
      <div className="bg-slate-950 border border-slate-805 p-5 rounded-xl mt-6">
        <h4 className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3.5">
          Bibliography Cross-References
        </h4>
        <div className="flex flex-wrap gap-2">
          {citations.map((cite) => (
            <button
              key={cite.id}
              onMouseEnter={() => setActiveCitation(cite)}
              onMouseLeave={() => setActiveCitation(null)}
              onClick={() => setActiveCitation(cite)}
              className="cursor-pointer flex items-center gap-1.5 bg-white hover:bg-slate-950 border border-slate-805 rounded px-2.5 py-1.5 text-xs text-slate-50 hover:text-slate-100 transition shadow-sm"
            >
              <CheckCircle className="h-3 w-3 text-slate-50" />
              <span className="font-mono text-[10px] font-bold">[{cite.id}]</span>
              <span className="max-w-[130px] truncate font-sans font-medium">{cite.publisher}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
