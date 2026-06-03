/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AgentCooperation, AgentCooperationNode, AgentMessage } from "../types";
import { Bot, Workflow, Sliders, MessageSquare, Plus, Play, Pause, FileText, Layers } from "lucide-react";

interface MultiAgentHubProps {
  cooperation?: AgentCooperation;
  topic: string;
}

export default function MultiAgentHub({ cooperation, topic }: MultiAgentHubProps) {
  // Agent states
  const [agents, setAgents] = useState<AgentCooperationNode[]>([]);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  
  // Handover state
  const [dispatchActive, setDispatchActive] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [dispatchedMessages, setDispatchedMessages] = useState<AgentMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<AgentMessage | null>(null);

  // Configuration sliders
  const [criticRigor, setCriticRigor] = useState(85);
  const [analystCompute, setAnalystCompute] = useState(90);

  // New Agent Spawn form states
  const [spawnName, setSpawnName] = useState("");
  const [spawnRole, setSpawnRole] = useState("");
  const [spawnDesc, setSpawnDesc] = useState("");

  useEffect(() => {
    if (cooperation && cooperation.agents && cooperation.agents.length > 0) {
      setAgents(cooperation.agents);
      setMessages(cooperation.messages);
      setDispatchedMessages(cooperation.messages);
      if (cooperation.messages.length > 0) {
        setSelectedMessage(cooperation.messages[0]);
      }
    } else {
      loadLocalMockCooperation();
    }
  }, [cooperation, topic]);

  const loadLocalMockCooperation = () => {
    const isBiotech = topic.toLowerCase().includes("crispr") || topic.toLowerCase().includes("epigenetic");
    
    const mockAgents: AgentCooperationNode[] = [
      { 
        name: "Literature Reviewer", 
        role: "Grounding Speculator", 
        description: isBiotech 
          ? "Crawls PubMed and Nature registries to consolidate CRISPR chromatin modification standards." 
          : "Crawls sports media engines, feed suppliers, and market predictions to build telemetry metrics.",
        status: "completed", 
        findingsCount: isBiotech ? 14 : 8 
      },
      { 
        name: "Statistical Analyst", 
        role: "Quantitative Computing", 
        description: isBiotech 
          ? "Transforms methylation transfection and passage stability statistics into structured tables." 
          : "Unifies sub-second betting volumes and latency metrics to evaluate prediction correlation ratios.",
        status: "completed", 
        findingsCount: isBiotech ? 9 : 12 
      },
      { 
        name: "Academic Critic", 
        role: "Integrity Verification", 
        description: "Vigorously validates source hash signatures, flags publisher bias limits, and defines unexplored research gaps.",
        status: "completed", 
        findingsCount: isBiotech ? 5 : 4 
      },
      { 
        name: "Synthesis Coordinator", 
        role: "Document Assembly", 
        description: "Resolves conflicting variables, drafts document divisions, and compiles works-cited APA/MLA lists.",
        status: "completed", 
        findingsCount: isBiotech ? 8 : 6 
      }
    ];

    const mockMessages: AgentMessage[] = [
      { 
        id: "m1", 
        fromAgent: "Literature Reviewer", 
        toAgent: "Statistical Analyst", 
        content: isBiotech
          ? "Extracted 14 peer-reviewed epigenetic reprogramming papers. Passing target gene locks and Cas9-KRAB modification logs."
          : "Sourced 8 sports analytical journals. Passing raw telemetry tables and micro-betting index bounds for indexing calculations.",
        timestamp: "16:15:35", 
        contextArtifact: isBiotech 
          ? JSON.stringify({ extracted_nodes: ["epigenetic_reprogramming", "cas9_modifiers"], paper_dois: ["10.1038/ng.1492", "10.1126/science.114a"], confidence_rating: 0.99 }, null, 2)
          : JSON.stringify({ telemetry_sources: ["Opta Live Feeds", "Kalshi Predictions"], market_caps: "4.2M", max_tolerated_latency_ms: 15 }, null, 2)
      },
      { 
        id: "m2", 
        fromAgent: "Statistical Analyst", 
        toAgent: "Academic Critic", 
        content: isBiotech
          ? "Formatted 3 quantitative methylation charts. Suppression index values verified at 92.4% with minimal dispersion."
          : "Formulated 4 Recharts data arrays. Converted micro-betting traffic and Solver latency (12.5ms) coefficients. Ready for threat audit.",
        timestamp: "16:15:42", 
        contextArtifact: isBiotech
          ? JSON.stringify({ suppression_rate: 0.924, off_target_index: 0.02, chromatin_methylation_ratio: "54:46" }, null, 2)
          : JSON.stringify({ predictive_ingestion_accuracy: 0.994, latency_overhead_ms: 12.5, matching_ratio: 0.988 }, null, 2)
      },
      { 
        id: "m3", 
        fromAgent: "Academic Critic", 
        toAgent: "Synthesis Coordinator", 
        content: isBiotech
          ? "Flagged unresolved biological gaps around CpG methylation progression. Verified Cryptographic Source Receipts."
          : "Audited Kalshi market signatures. Discovered a secondary gap covering CTV Live target locking. Passing cryptographic proof seals.",
        timestamp: "16:15:51", 
        contextArtifact: isBiotech
          ? JSON.stringify({ checked_hash_signatures: ["0xa31f...bc", "0xb7c0...09"], flagged_bias_risk: "low", detected_gaps: ["unexplored_epigenetic_drift"] }, null, 2)
          : JSON.stringify({ audited_receipt_checksums: ["0x89f2...da", "0x12a0...f2"], bias_metrics: "low", uncovered_blindspots: ["unexplored_ctv_sync"] }, null, 2)
      },
      { 
        id: "m4", 
        fromAgent: "Synthesis Coordinator", 
        toAgent: "Literature Reviewer", 
        content: "Formulated APA, MLA, and IEEE bibliographic elements. SOTA publication thesis locked. Resolving collaboration handover.",
        timestamp: "16:15:58", 
        contextArtifact: JSON.stringify({ system_time_utc: new Date().toISOString(), bibliography_elements: 3, grade_awarded: "Grade A Approved" }, null, 2)
      }
    ];

    setAgents(mockAgents);
    setMessages(mockMessages);
    setDispatchedMessages(mockMessages);
    if (mockMessages.length > 0) {
      setSelectedMessage(mockMessages[0]);
    }
  };

  useEffect(() => {
    let timer: any;
    if (dispatchActive) {
      setActiveStep(0);
      setDispatchedMessages([]);
      
      let step = 0;
      timer = setInterval(() => {
        if (step < messages.length) {
          setDispatchedMessages(prev => [...prev, messages[step]]);
          setSelectedMessage(messages[step]);
          
          setAgents(prev => prev.map((a, idx) => {
            if (idx === step) return { ...a, status: "completed" };
            if (idx === step + 1) return { ...a, status: "processing" };
            return { ...a, status: idx > step ? "idle" : "completed" };
          }));

          setActiveStep(step);
          step++;
        } else {
          setDispatchActive(false);
          setActiveStep(null);
          setAgents(prev => prev.map(a => ({ ...a, status: "completed" })));
        }
      }, 1800);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [dispatchActive, messages]);

  const handleStartDispatch = () => {
    setDispatchActive(true);
  };

  const handleStopDispatch = () => {
    setDispatchActive(false);
    setActiveStep(null);
    if (cooperation && cooperation.agents && cooperation.agents.length > 0) {
      setAgents(cooperation.agents);
      setMessages(cooperation.messages);
      setDispatchedMessages(cooperation.messages);
    } else {
      loadLocalMockCooperation();
    }
  };

  const handleSpawnCustomAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spawnName.trim() || !spawnRole.trim()) return;

    const newAgent: AgentCooperationNode = {
      name: spawnName,
      role: spawnRole,
      description: spawnDesc || "Autonomous helper integrated dynamically in the collaboration loop.",
      status: "idle",
      findingsCount: 0
    };

    setAgents([...agents, newAgent]);

    const lastMsgId = `m${messages.length + 1}`;
    const targetAgentName = agents[0]?.name || "Literature Reviewer";
    const newMsg: AgentMessage = {
      id: lastMsgId,
      fromAgent: spawnName,
      toAgent: targetAgentName,
      content: `Dispatched custom parameters. Collaborating as specializing ${spawnRole}.`,
      timestamp: new Date().toLocaleTimeString(),
      contextArtifact: JSON.stringify({ spawn_parameters: { role: spawnRole, target_agent: targetAgentName } }, null, 2)
    };

    const newMsgList = [...messages, newMsg];
    setMessages(newMsgList);
    setDispatchedMessages(newMsgList);
    setSelectedMessage(newMsg);

    setSpawnName("");
    setSpawnRole("");
    setSpawnDesc("");
  };

  return (
    <div className="bg-white border border-slate-805 rounded-xl p-6 flex flex-col gap-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-805 pb-4 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 bg-slate-950 border border-slate-805 rounded-lg flex items-center justify-center text-slate-50">
            <Bot className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-slate-100 text-sm">
              Cooperation Pipeline
            </h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Multi-Agent Handover Status
            </p>
          </div>
        </div>

        {/* Dispatch Controls */}
        <div className="flex items-center gap-2">
          {dispatchActive ? (
            <button
              onClick={handleStopDispatch}
              className="bg-slate-950 hover:bg-slate-900 text-white border border-slate-805 px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition select-none"
            >
              <Pause className="h-3.5 w-3.5 text-white" />
              <span>Reset Cascade</span>
            </button>
          ) : (
            <button
              onClick={handleStartDispatch}
              className="bg-slate-50 hover:bg-slate-350 text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition select-none"
            >
              <Play className="h-3.5 w-3.5 text-white" />
              <span>Run Verification Loop</span>
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-505 leading-relaxed -mt-1 font-sans">
        Review current pipeline structures. Sourced metadata is handed off downstream and checked by adversary algorithms to produce completely grounded records.
      </p>

      {/* Grid: Handover Queue visual pipeline + active message blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Agent stack (Occupies 5 spans) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block border-b border-slate-805 pb-2 font-medium">
            Workflow Roster
          </span>

          <div className="flex flex-col gap-3 max-h-[460px] overflow-y-auto pr-1">
            {agents.map((agent, index) => {
              const isActive = activeStep === index;
              const isProcessing = agent.status === "processing";
              const isComp = agent.status === "completed";

              return (
                <div
                  key={index}
                  className={`border rounded-xl p-4 transition duration-300 relative overflow-hidden flex flex-col gap-2 ${
                    isActive 
                      ? "bg-slate-950 border-slate-805" 
                      : isProcessing 
                        ? "bg-slate-950 border-slate-850" 
                        : "bg-white border-slate-805"
                  }`}
                >
                  {/* Status Line */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    isActive 
                      ? "bg-slate-50 pb" 
                      : isComp 
                        ? "bg-slate-600" 
                        : isProcessing 
                          ? "bg-slate-400" 
                          : "bg-slate-100"
                  }`} />

                  {/* Agent Header line */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col pl-2">
                      <span className="text-xs font-heading font-semibold text-slate-50">
                        {agent.name}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 uppercase">
                        {agent.role}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                      isComp 
                        ? "bg-slate-950 text-white border border-slate-805" 
                        : isProcessing 
                          ? "bg-slate-950 text-white border border-slate-850" 
                          : "bg-white text-slate-400"
                    }`}>
                      {agent.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed pl-2 font-sans">
                    {agent.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-805/40 pt-2 pl-2 text-[10px] font-mono text-slate-400">
                    <span>SEALED OBJECTS:</span>
                    <span className="font-bold text-slate-50">{agent.findingsCount} objects</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Sliders controller */}
          <div className="bg-slate-950 border border-slate-805 rounded-xl p-4 flex flex-col gap-3">
            <span className="text-[9px] font-mono text-slate-450 uppercase tracking-widest flex items-center gap-1 font-semibold">
              <Sliders className="h-3 w-3 text-slate-400" />
              <span>Compliance Coefficients</span>
            </span>

            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-1 text-[10px] text-slate-400 font-mono">
                <div className="flex justify-between">
                  <span>Adversarial Scrutiny:</span>
                  <span className="text-white font-bold">{criticRigor}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={criticRigor}
                  onChange={(e) => setCriticRigor(Number(e.target.value))}
                  className="w-full accent-slate-50 h-1 bg-slate-800 rounded-lg outline-none cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1 text-[10px] text-slate-400 font-mono">
                <div className="flex justify-between">
                  <span>Synthesis Rigor:</span>
                  <span className="text-white font-bold">{analystCompute}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={analystCompute}
                  onChange={(e) => setAnalystCompute(Number(e.target.value))}
                  className="w-full accent-slate-50 h-1 bg-slate-800 rounded-lg outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Message Thread Queue & JSON inspector (Occupies 7 spans) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block border-b border-slate-805 pb-2 font-medium">
            Active Message Streams
          </span>

          <div className="bg-slate-950 border border-slate-805 rounded-xl p-4 flex flex-col gap-3 h-64 overflow-y-auto">
            {dispatchedMessages.length > 0 ? (
              dispatchedMessages.map((msg, idx) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedMessage(msg)}
                    className={`p-3.5 rounded-lg border text-left cursor-pointer transition select-none flex flex-col gap-1.5 ${
                      isSelected 
                        ? "bg-white border-slate-805 shadow-sm text-slate-100" 
                        : "bg-transparent border-transparent hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono border-b border-slate-805/40 pb-1.5">
                      <div className="flex items-center gap-1 text-slate-200">
                        <span className="font-bold">{msg.fromAgent}</span>
                        <span className="text-slate-500">➔</span>
                        <span className="font-medium text-slate-400">{msg.toAgent}</span>
                      </div>
                      <span className="text-slate-500 font-mono">{msg.timestamp}</span>
                    </div>

                    <p className={`text-xs leading-relaxed font-sans ${isSelected ? "text-slate-500" : "text-slate-450"} italic`}>
                      "{msg.content}"
                    </p>

                    {msg.contextArtifact && (
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase mt-1">
                        <Layers className="h-3 w-3" />
                        <span>Payload ID #{msg.id.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-center text-xs text-slate-500">
                <Workflow className="h-5 w-5 opacity-40 animate-pulse text-slate-400" />
                <span>Verification channel inactive. Run the cascade above.</span>
              </div>
            )}
          </div>

          {/* Handover Payload Inspector block */}
          <div className="bg-slate-950 border border-slate-805 rounded-xl p-5 flex flex-col gap-3.5">
            <div className="flex items-center justify-between border-b border-slate-850/40 pb-1.5">
              <span className="text-[10px] font-mono text-slate-450 uppercase tracking-widest font-semibold">
                Trace payload parameters
              </span>
              <FileText className="h-3.5 w-3.5 text-slate-400" />
            </div>

            {selectedMessage && selectedMessage.contextArtifact ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 uppercase">
                  <span>Packet Address: #{selectedMessage.id.toUpperCase()}</span>
                  <span>Validation Ok</span>
                </div>
                
                <pre className="bg-white border border-slate-805 rounded-lg p-3.5 font-mono text-[10px] text-slate-50 overflow-x-auto max-h-36 leading-normal text-left">
                  {selectedMessage.contextArtifact}
                </pre>
              </div>
            ) : (
              <div className="py-4 text-center text-[10px] font-mono text-slate-500">
                Select a message block upper flow to inspect serialized context records.
              </div>
            )}
          </div>

          {/* Create custom agent */}
          <div className="bg-white border border-slate-805 rounded-xl p-5 flex flex-col shadow-sm">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3.5 block border-b border-slate-805 pb-1.5">
              Register Custom Specialist Adapter
            </span>
            <form onSubmit={handleSpawnCustomAgent} className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-end">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono font-medium text-slate-500 uppercase">Agent Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Risk Analyst"
                  value={spawnName}
                  onChange={(e) => setSpawnName(e.target.value)}
                  className="bg-slate-950 border border-slate-805 p-2.5 text-xs text-slate-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono font-medium text-slate-505 uppercase">Role Objectives</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., CTV Synchronization"
                  value={spawnRole}
                  onChange={(e) => setSpawnRole(e.target.value)}
                  className="bg-slate-950 border border-slate-805 p-2.5 text-xs text-slate-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans"
                />
              </div>

              <button
                type="submit"
                className="bg-slate-50 hover:bg-slate-350 text-white font-medium py-3 px-4 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition select-none"
              >
                <Plus className="h-3.5 w-3.5 text-white" />
                <span>Register Specialist</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
