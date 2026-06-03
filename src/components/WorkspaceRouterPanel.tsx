/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Send, Lock, Unlock, Check, AlertTriangle, RefreshCw } from "lucide-react";
import { WorkspaceQueryIntent } from "../types";

interface WorkspaceRouterPanelProps {
  onRouteCommand: (command: string) => Promise<void>;
  currentIntent: WorkspaceQueryIntent | null;
  onConfirmIntent: (intent: WorkspaceQueryIntent) => void;
  onRejectIntent: () => void;
  isLoading: boolean;
  currentReportSubject: string;
}

const COMMAND_TEMPLATES = [
  {
    cmd: "Schedule a critical deck presentation and debrief on Friday at 2:30 PM.",
    label: "📅 Schedule Presentation"
  },
  {
    cmd: "Draft a summary email to investor@aurafunds.vc containing key bullet findings.",
    label: "✉️ Draft Investor Mail"
  },
  {
    cmd: "Create high priority task to audit provenance checksums.",
    label: "✅ Create Todo Task"
  }
];

export default function WorkspaceRouterPanel({
  onRouteCommand,
  currentIntent,
  onConfirmIntent,
  onRejectIntent,
  isLoading,
  currentReportSubject
}: WorkspaceRouterPanelProps) {
  const [command, setCommand] = useState("");
  const [editedTime, setEditedTime] = useState("");
  const [editedRecipient, setEditedRecipient] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      onRouteCommand(command);
    }
  };

  React.useEffect(() => {
    if (currentIntent) {
      setEditedTime(currentIntent.parameters.time || "");
      setEditedRecipient(currentIntent.parameters.recipient || "");
    }
  }, [currentIntent]);

  return (
    <div className="bg-white border border-slate-805 rounded-xl p-6 flex flex-col gap-5">
      {/* Title */}
      <div className="border-b border-slate-805 pb-3 flex items-center justify-between">
        <h2 className="font-heading font-medium text-xs text-slate-50 uppercase tracking-widest">
          Workspace Integrations
        </h2>
        <span className="text-[10px] font-mono text-slate-600 uppercase">Interactive Authorization</span>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed font-sans">
        Delegate follow-ups, emails, or scheduling tasks instantly. Writing actions remain held in a verification lock until you approve the dispatch.
      </p>

      {/* Templates / Prompts */}
      <div className="flex flex-wrap gap-2">
        {COMMAND_TEMPLATES.map((item, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isLoading}
            onClick={() => {
              setCommand(item.cmd);
              onRouteCommand(item.cmd);
            }}
            className="text-[10px] bg-slate-950 hover:bg-slate-900 text-slate-50 border border-slate-805 px-2.5 py-1.5 rounded-md transition text-left cursor-pointer font-sans font-medium"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Command Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          id="workspace-command-input"
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          disabled={isLoading}
          placeholder="e.g., Draft summary email or schedule presentation..."
          className="flex-1 bg-slate-950 border border-slate-805 rounded-lg px-3.5 py-2.5 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder-slate-600 font-sans"
        />
        <button
          type="submit"
          disabled={isLoading || !command.trim()}
          className="bg-slate-50 hover:bg-slate-350 disabled:bg-slate-850 text-white disabled:text-slate-500 px-4 rounded-lg flex items-center justify-center cursor-pointer transition select-none"
        >
          {isLoading ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
        </button>
      </form>

      {/* Active Workspace Routing Evaluation Frame */}
      {currentIntent && (
        <div className="border border-slate-805 bg-slate-950 rounded-lg p-4 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-850/40 pb-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-50 font-semibold font-mono">
              <span className="text-[10px] uppercase font-bold text-slate-500">INTENT:</span>
              <span className="text-slate-50 uppercase font-semibold tracking-wider font-sans">{currentIntent.predictedAction}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Confidence: {Math.round(currentIntent.confidence * 100)}%
            </span>
          </div>

          {/* Structured Parameters Extract */}
          <div className="flex flex-col gap-2 font-mono text-[10px] text-slate-350 bg-white border border-slate-850 rounded p-3">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest block border-b border-slate-850 pb-1.5 mb-1">
              Parsed Parameters
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-slate-300 font-sans">
              <span className="text-slate-500">Operation:</span>
              <span className="col-span-2 text-slate-50 font-semibold">{currentIntent.predictedAction}</span>

              <span className="text-slate-505">Subject:</span>
              <span className="col-span-2 text-slate-50 font-medium truncate">
                {currentReportSubject || "Continuous Analytics Setup"}
              </span>

              {currentIntent.parameters.recipient && (
                <>
                  <span className="text-slate-505">Recipient:</span>
                  <input
                    type="email"
                    value={editedRecipient}
                    onChange={(e) => setEditedRecipient(e.target.value)}
                    className="col-span-2 bg-slate-950 border border-slate-805 rounded px-2 py-1 text-[10px] text-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                  />
                </>
              )}

              {currentIntent.parameters.time && (
                <>
                  <span className="text-slate-505">Proposed Time:</span>
                  <input
                    type="text"
                    value={editedTime}
                    onChange={(e) => setEditedTime(e.target.value)}
                    className="col-span-2 bg-slate-950 border border-slate-805 rounded px-2 py-1 text-[10px] text-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                  />
                </>
              )}

              {currentIntent.parameters.priority && (
                <>
                  <span className="text-slate-505">Priority:</span>
                  <span className="col-span-2 text-slate-50 font-semibold uppercase">{currentIntent.parameters.priority}</span>
                </>
              )}
            </div>
          </div>

          {/* Conflict Resolution Indicator */}
          {currentIntent.parameters.conflicts && currentIntent.parameters.conflicts.length > 0 && (
            <div className="bg-red-50 border border-red-250 rounded p-3.5 flex gap-2.5">
              <AlertTriangle className="h-4.5 w-4.5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider">
                  Scheduling Conflict Detected
                </span>
                <p className="text-xs text-red-700 leading-relaxed font-sans">
                  {currentIntent.parameters.conflicts[0].reason}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEditedTime("Thursday, 4:00 PM");
                    currentIntent.parameters.conflicts = [];
                  }}
                  className="mt-2 text-left text-[10px] font-mono text-slate-50 underline hover:text-slate-500 cursor-pointer font-semibold"
                >
                  [Auto-Resolve: Reschedule to Thursday, 4:00 PM]
                </button>
              </div>
            </div>
          )}

          {/* Action Authorization Gate */}
          <div className={`rounded-xl p-4 flex flex-col gap-3.5 border ${
            currentIntent.lockStatus === "locked_pending"
              ? "bg-amber-50 border-amber-200 text-amber-900"
              : currentIntent.lockStatus === "approved"
              ? "bg-emerald-50 border-emerald-250 text-emerald-900"
              : "bg-white border-slate-805 text-slate-50"
          }`}>
            <div className="flex items-center gap-3">
              {currentIntent.lockStatus === "locked_pending" ? (
                <>
                  <Lock className="h-5 w-5 text-amber-650 shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-widest leading-none">
                      Awaiting Manual Approval
                    </span>
                    <span className="text-[10px] text-amber-600 font-medium">
                      Action is locked pending authorization keys
                    </span>
                  </div>
                </>
              ) : currentIntent.lockStatus === "approved" ? (
                <>
                  <Check className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest leading-none">
                      Dispatch Approved
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">
                      Changes successfully written
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <Unlock className="h-4.5 w-4.5 text-slate-500 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">Cleared</span>
                </>
              )}
            </div>

            {currentIntent.lockStatus === "locked_pending" && (
              <div className="flex justify-end gap-2.5 border-t border-amber-100/60 pt-3 mt-1">
                <button
                  type="button"
                  onClick={onRejectIntent}
                  className="px-3 py-1.5 text-[10px] font-semibold bg-white hover:bg-slate-950 border border-amber-200 text-amber-800 rounded-md cursor-pointer transition active:scale-[0.98]"
                >
                  Reject Bypass
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const updated = {
                      ...currentIntent,
                      parameters: {
                        ...currentIntent.parameters,
                        time: editedTime,
                        recipient: editedRecipient
                      }
                    };
                    onConfirmIntent(updated);
                  }}
                  className="px-3.5 py-1.5 text-[10px] font-bold bg-slate-50 hover:bg-slate-350 text-white rounded-md flex items-center gap-1 cursor-pointer transition active:scale-[0.98]"
                >
                  <Unlock className="h-3 w-3 text-white" />
                  Approve Dispatch
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
