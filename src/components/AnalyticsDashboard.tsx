/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { VisualDataset, TimelineEvent } from "../types";
import { TrendingUp, Milestone, BarChart3, HelpCircle } from "lucide-react";

interface AnalyticsDashboardProps {
  datasets: VisualDataset[];
  timeline: TimelineEvent[];
}

export default function AnalyticsDashboard({ datasets, timeline }: AnalyticsDashboardProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Metrics Header */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <BarChart3 className="h-5 w-5 text-cyan-400" />
        <h2 className="font-heading font-semibold text-sm uppercase tracking-wider text-slate-200">
          Domain Analytics Workbench
        </h2>
      </div>

      <p className="text-xs text-slate-400 leading-normal mb-1">
        This panel visualizes quantitative markers extracted and normalized from deep-research documents. Metrics include growth margins and domain relevance indicators.
      </p>

      {/* Grid: Recharts + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metric Bar Chart */}
        <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
            <span className="text-xs font-heading font-semibold text-white">Quantitative Core Metrics</span>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="h-64 w-full text-slate-350">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datasets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px" }}
                  labelStyle={{ color: "#06b6d4", fontSize: "11px", fontFamily: "monospace" }}
                  itemStyle={{ color: "#f1f5f9", fontSize: "11px" }}
                />
                <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Index Score" />
                <Bar dataKey="relevance" fill="#10b981" radius={[4, 4, 0, 0]} name="Confidence Rating" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Index Alignment */}
        <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
            <span className="text-xs font-heading font-semibold text-white">Domain Affinity Matrix</span>
            <Milestone className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={datasets}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="label" stroke="#94a3b8" fontSize={9} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} />
                <Radar name="Active Coefficient" dataKey="value" stroke="#059669" fill="#10b981" fillOpacity={0.2} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px" }}
                  itemStyle={{ fontSize: "11px" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Custom Chronological Timeline (D3-inspired SVG construction) */}
      <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
          <Milestone className="h-4.5 w-4.5 text-cyan-400" />
          <h3 className="font-heading font-semibold text-xs text-white uppercase tracking-wider">
            SOTA Chronological Landmarks Timeline
          </h3>
        </div>

        {/* Interactive Timeline Rail */}
        <div className="relative pl-6 md:pl-0 flex flex-col md:flex-row md:justify-between gap-6 md:gap-4 py-4 min-h-[140px]">
          {/* Main Horizontal Connecting Pipe (Hidden on Mobile) */}
          <div className="hidden md:block absolute top-[43px] left-8 right-8 h-0.5 bg-slate-800" />

          {timeline.map((item, idx) => (
            <div
              key={idx}
              className="relative flex-1 flex flex-col items-start md:items-center text-left md:text-center group"
            >
              {/* Vertical Connector (Mobile only) */}
              <div className="md:hidden absolute top-4 bottom-[-24px] left-[-15px] w-0.5 bg-slate-800" />

              {/* Chronicle Node Counter */}
              <div className="absolute top-[3px] md:top-8 left-[-23px] md:left-auto h-5 w-5 rounded-full border border-slate-800 bg-slate-950 hover:border-cyan-400 flex items-center justify-center text-[10px] font-mono font-bold text-slate-400 group-hover:text-cyan-450 z-15 transition-all">
                {idx + 1}
              </div>

              {/* Temporal Badge */}
              <span className="text-[10px] select-none font-mono font-bold bg-slate-900 border border-slate-800 text-cyan-400 px-2 py-0.5 rounded-sm uppercase tracking-wider mb-2 z-10">
                {item.date}
              </span>

              {/* Event Header */}
              <h4 className="font-heading font-semibold text-xs text-white leading-tight mb-1 mt-1 md:mt-6">
                {item.event}
              </h4>

              {/* Narrative Segment */}
              <p className="text-[11px] text-slate-400 leading-normal text-left md:text-center max-w-[190px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
