/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ResearchGrade } from "../types";
import { Award, AlertOctagon, CheckSquare, Sparkles } from "lucide-react";

interface GradingReportProps {
  grade: ResearchGrade;
  topic: string;
}

export default function GradingReport({ grade, topic }: GradingReportProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-6 shadow-[0_4px_25px_rgba(0,0,0,0.3)]">
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Award className="h-5 w-5 text-emerald-400" />
        <h2 className="font-heading font-semibold text-sm uppercase tracking-wider text-slate-200">
          Core Object Quality Assessment
        </h2>
      </div>

      <p className="text-xs text-slate-400 leading-normal">
        All generated target artifacts pass through AURA's evaluation pipeline before rendering. Metrics reflect source corroboration levels across academic registries and live-scraped networks.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Big Score Gauge Block */}
        <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-mono text-slate-550 uppercase tracking-widest mb-1.5">
            OVERALL RESOLVER GRADE
          </span>
          <div className="relative flex items-center justify-center">
            {/* Numeric display */}
            <div className="flex flex-col items-center z-10">
              <span className="font-heading text-4xl font-extrabold text-emerald-400 leading-none">
                {grade.overallScore}
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-1">
                /100 INDEX
              </span>
            </div>
            
            {/* Rotating subtle halo */}
            <div className="absolute h-24 w-24 rounded-full border border-dashed border-emerald-500/20 animate-spin" style={{ animationDuration: "12s" }} />
          </div>
          
          <div className="mt-4 bg-emerald-950/40 border border-emerald-900/50 rounded-lg px-2.5 py-1 text-[11px] text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>Grade A Consensus</span>
          </div>
        </div>

        {/* Breakdown Bars Block */}
        <div className="md:col-span-2 bg-slate-950 border border-slate-850 rounded-xl p-5 flex flex-col justify-between gap-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block border-b border-slate-900 pb-2">
            Verification Sub-Indexes
          </span>

          <div className="flex flex-col gap-3">
            {/* Completeness Rate */}
            <div className="flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between items-center text-slate-400">
                <span>COMPLETENESS INDEX:</span>
                <span className="font-mono text-slate-200">{grade.completeness}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div style={{ width: `${grade.completeness}%` }} className="h-full bg-cyan-500 rounded-full" />
              </div>
            </div>

            {/* Accuracy Rate */}
            <div className="flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between items-center text-slate-400">
                <span>ACCURACY RATING:</span>
                <span className="font-mono text-slate-200">{grade.accuracy}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div style={{ width: `${grade.accuracy}%` }} className="h-full bg-teal-500 rounded-full" />
              </div>
            </div>

            {/* Credibility Rate */}
            <div className="flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between items-center text-slate-400">
                <span>CREDIBILITY COEFFICIENT:</span>
                <span className="font-mono text-slate-200">{grade.credibility}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div style={{ width: `${grade.credibility}%` }} className="h-full bg-emerald-500 rounded-full" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono border-t border-slate-900 pt-2 text-slate-500">
            <span>BIAS RISK ANALYSIS:</span>
            <span className={`font-bold uppercase ${
              grade.biasRisk === "Low" ? "text-emerald-400" : "text-amber-400"
            }`}>
              {grade.biasRisk} RISK PROFILE
            </span>
          </div>
        </div>
      </div>

      {/* Consensus Statement Text Area */}
      <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl flex gap-3.5 items-start">
        <CheckSquare className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1 leading-normal">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            AURA Evaluator consensus feedback statement
          </span>
          <p className="text-xs text-slate-300">
            {grade.feedback}
          </p>
        </div>
      </div>
    </div>
  );
}
