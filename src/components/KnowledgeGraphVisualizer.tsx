/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { KnowledgeGraph, KnowledgeGraphNode, KnowledgeGraphLink } from "../types";
import { Network, HelpCircle, Lightbulb, Plus, Cpu, Layers, Beaker, CheckCircle2, RotateCcw, Eye, Sparkles } from "lucide-react";

interface KnowledgeGraphVisualizerProps {
  graph?: KnowledgeGraph;
  topic: string;
}

// Initial default positions layout if state isn't populated
const DEFAULT_COORDS: Record<string, { x: number; y: number }> = {
  // Sports Focus
  "sports_analytics": { x: 220, y: 150 },
  "micro_betting": { x: 420, y: 180 },
  "resolver_core": { x: 300, y: 320 },
  "kalshi_prediction": { x: 550, y: 120 },
  "source_receipts": { x: 120, y: 360 },
  "unexplored_ctv_sync": { x: 580, y: 300 },
  // Biotech Focus
  "epigenetic_reprogramming": { x: 250, y: 160 },
  "lnp_carriers": { x: 450, y: 120 },
  "cas9_modifiers": { x: 300, y: 350 },
  "multiplexing": { x: 150, y: 280 },
  "bisulfite_sequencing": { x: 550, y: 280 },
  "unexplored_epigenetic_drift": { x: 480, y: 400 }
};

export default function KnowledgeGraphVisualizer({ graph, topic }: KnowledgeGraphVisualizerProps) {
  // State for active node list and links
  const [nodes, setNodes] = useState<KnowledgeGraphNode[]>([]);
  const [links, setLinks] = useState<KnowledgeGraphLink[]>([]);
  
  // Simulation and interactive states
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  // Graph toggles
  const [highlightGapsOnly, setHighlightGapsOnly] = useState(false);
  const [isDraggabilityActive, setIsDraggabilityActive] = useState(true);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  
  // Custom Entity Constructor State
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState<"concept" | "technology" | "organization" | "parameter" | "gap">("concept");
  const [newDesc, setNewDesc] = useState("");
  const [linkTargetId, setLinkTargetId] = useState("");
  const [linkRelation, setLinkRelation] = useState("correlates_with");

  // Custom AI Ingest Sandbox State
  const [sandboxText, setSandboxText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state when parent graph changes
  useEffect(() => {
    if (graph && graph.nodes && graph.nodes.length > 0) {
      setNodes(graph.nodes);
      setLinks(graph.links);
      
      // Seed positions
      const newCoords: Record<string, { x: number; y: number }> = {};
      graph.nodes.forEach((n, idx) => {
        if (DEFAULT_COORDS[n.id]) {
          newCoords[n.id] = { ...DEFAULT_COORDS[n.id] };
        } else {
          // Circular distribution fallback for custom nodes
          const angle = (idx / graph.nodes.length) * 2 * Math.PI;
          newCoords[n.id] = {
            x: 350 + 180 * Math.cos(angle),
            y: 250 + 140 * Math.sin(angle)
          };
        }
      });
      setNodePositions(newCoords);
      setSelectedNode(graph.nodes[0]);
    } else {
      // Fallback local structures if topic changed but graph is undefined
      loadLocalMockGraph();
    }
  }, [graph, topic]);

  const loadLocalMockGraph = () => {
    const isBiotech = topic.toLowerCase().includes("crispr") || topic.toLowerCase().includes("epigenetic");
    if (isBiotech) {
      const mockNodes: KnowledgeGraphNode[] = [
        { id: "epigenetic_reprogramming", label: "Epigenetic Reprogramming", type: "concept", description: "Directing gene activation or suppression without introducing chromosomal breaklines.", relevanceScore: 97 },
        { id: "lnp_carriers", label: "Lipid Nanoparticles (LNPs)", type: "technology", description: "Targeted synthetic structures configured with cell-selective surface antigens.", relevanceScore: 94 },
        { id: "cas9_modifiers", label: "Fused Cas9 Chromatin Modifiers", type: "technology", description: "Cas9 variants coupled with chromatin writers (DNMT3A, TET1) for localized modification.", relevanceScore: 96 },
        { id: "multiplexing", label: "Multiplex Target Modulation", type: "concept", description: "Simultaneous regulation of multiple genomic loci in a single cellular delivery step.", relevanceScore: 92 },
        { id: "bisulfite_sequencing", label: "Bisulfite Integrity Testing", type: "technology", description: "Primary assay pipeline used to check long-term retention of DNA methylation across cell generations.", relevanceScore: 89 },
        { id: "unexplored_epigenetic_drift", label: "Histone-to-Methylation Long-term Drift", type: "gap", description: "Unexplored correlation: How long-term histone adjustments drift or transition into stable DNA methylation states over multi-organ contexts.", relevanceScore: 87 }
      ];
      const mockLinks: KnowledgeGraphLink[] = [
        { source: "epigenetic_reprogramming", target: "cas9_modifiers", relationship: "achieved_via" },
        { source: "cas9_modifiers", target: "lnp_carriers", relationship: "delivered_by" },
        { source: "multiplexing", target: "epigenetic_reprogramming", relationship: "scales_up" },
        { source: "bisulfite_sequencing", target: "epigenetic_reprogramming", relationship: "validates_stability" },
        { source: "unexplored_epigenetic_drift", target: "cas9_modifiers", relationship: "impacts_duration", unexplored: true },
        { source: "unexplored_epigenetic_drift", target: "bisulfite_sequencing", relationship: "requires_assays", unexplored: true }
      ];
      setNodes(mockNodes);
      setLinks(mockLinks);
      
      const coords: Record<string, { x: number; y: number }> = {};
      mockNodes.forEach(n => {
        coords[n.id] = { ...DEFAULT_COORDS[n.id] };
      });
      setNodePositions(coords);
      setSelectedNode(mockNodes[0]);
    } else {
      // Sports fallback
      const mockNodes: KnowledgeGraphNode[] = [
        { id: "sports_analytics", label: "Sports Analytics Pipeline", type: "technology", description: "Standard high-throughput telemetry stream pipeline used for tracking real-time match events.", relevanceScore: 95 },
        { id: "micro_betting", label: "Micro-Betting Invariants", type: "concept", description: "Predictive wagering models built to resolve next-step micro developments within sports events.", relevanceScore: 98 },
        { id: "resolver_core", label: "AURA State-Based Resolver", type: "technology", description: "Multi-layered state controller determining source data routing based on live or terminal game phases.", relevanceScore: 100 },
        { id: "kalshi_prediction", label: "Kalshi Prediction Markets", type: "organization", description: "Regulated prediction exchange platform used to query real-time market sentiments for current sport brackets.", relevanceScore: 92 },
        { id: "source_receipts", label: "Cryptographic Source Receipts", type: "technology", description: "SHA-256 seal establishing data lineage verification and proof-of-precision constraints.", relevanceScore: 96 },
        { id: "unexplored_ctv_sync", label: "CTV Dynamic Sports Interlocking", type: "gap", description: "Unexplored correlation: Syncing micro-betting sentiment with live CTV ad networks based on regional bias parameters.", relevanceScore: 88 }
      ];
      const mockLinks: KnowledgeGraphLink[] = [
        { source: "sports_analytics", target: "micro_betting", relationship: "enables" },
        { source: "micro_betting", target: "resolver_core", relationship: "requires_latency" },
        { source: "resolver_core", target: "source_receipts", relationship: "seals_with" },
        { source: "kalshi_prediction", target: "micro_betting", relationship: "corroborates_volume" },
        { source: "unexplored_ctv_sync", target: "sports_analytics", relationship: "leverages_telemetry", unexplored: true },
        { source: "unexplored_ctv_sync", target: "kalshi_prediction", relationship: "grows_from", unexplored: true }
      ];
      setNodes(mockNodes);
      setLinks(mockLinks);
      
      const coords: Record<string, { x: number; y: number }> = {};
      mockNodes.forEach(n => {
        coords[n.id] = { ...DEFAULT_COORDS[n.id] };
      });
      setNodePositions(coords);
      setSelectedNode(mockNodes[0]);
    }
  };

  // Node Drag and Interaction Logic
  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    if (!isDraggabilityActive) return;
    setDraggedNodeId(id);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNodeId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Bounds clamping
    const x = Math.max(20, Math.min(rect.width - 20, e.clientX - rect.left));
    const y = Math.max(20, Math.min(rect.height - 20, e.clientY - rect.top));

    setNodePositions(prev => ({
      ...prev,
      [draggedNodeId]: { x, y }
    }));
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  // Click handler to select node and display properties
  const handleNodeClick = (node: KnowledgeGraphNode) => {
    setSelectedNode(node);
  };

  // Color mappings per node type
  const getTypeColor = (type?: string, isFill = true) => {
    if (isFill) {
      switch (type) {
        case "concept": return "bg-indigo-600 border-indigo-400 text-indigo-200";
        case "technology": return "bg-emerald-600 border-emerald-400 text-emerald-200";
        case "organization": return "bg-purple-600 border-purple-400 text-purple-200";
        case "parameter": return "bg-amber-600 border-amber-400 text-amber-200";
        case "gap": return "bg-rose-950/40 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)] animate-pulse";
        default: return "bg-slate-800 border-slate-600 text-slate-350";
      }
    } else {
      switch (type) {
        case "concept": return "#6366f1";
        case "technology": return "#10b981";
        case "organization": return "#a855f7";
        case "parameter": return "#f59e0b";
        case "gap": return "#f43f5e";
        default: return "#94a3b8";
      }
    }
  };

  // Reset node coordinate layout
  const handleResetLayout = () => {
    loadLocalMockGraph();
  };

  // Inject a manual entity node
  const handleAddCustomNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const newId = newLabel.toLowerCase().replace(/\s+/g, "_");
    
    // Ensure uniqueness
    if (nodes.some(n => n.id === newId)) {
      alert("A concept node with this name already exists.");
      return;
    }

    const newNode: KnowledgeGraphNode = {
      id: newId,
      label: newLabel,
      type: newType,
      description: newDesc || `${newLabel} is an added user entity integrated into the workflow.`,
      relevanceScore: 85
    };

    const newNodes = [...nodes, newNode];
    setNodes(newNodes);

    // Place randomly in central area of drawing canvas
    const newCoords = {
      ...nodePositions,
      [newId]: { x: 300 + Math.random() * 100, y: 200 + Math.random() * 100 }
    };
    setNodePositions(newCoords);

    // If there is an existing target select, link them
    if (linkTargetId) {
      const newLink: KnowledgeGraphLink = {
        source: newId,
        target: linkTargetId,
        relationship: linkRelation,
        unexplored: newType === "gap"
      };
      setLinks([...links, newLink]);
    }

    setSelectedNode(newNode);
    setNewLabel("");
    setNewDesc("");
    setLinkTargetId("");
  };

  // Simulated Deep Autonomic Semantic Parser
  const handleIngestSandboxText = async () => {
    if (!sandboxText.trim()) return;
    setIsExtracting(true);
    setExtractionResult(null);

    // Wait 1.5s to simulate deep-analysis extraction
    await new Promise(resolve => setTimeout(resolve, 1400));

    // Simple parser to pull tokens/keywords and spawn connection
    const textToLower = sandboxText.toLowerCase();
    
    let extractedNodeId = "";
    let extractedLabel = "";
    let extractedType: "concept" | "technology" | "organization" | "gap" = "concept";
    let relationship = "corroborates";
    let parentTargetId = nodes[0]?.id || "resolver_core";
    let extractedDesc = "";

    if (textToLower.includes("adversarial") || textToLower.includes("discrepancy") || textToLower.includes("exploit") || textToLower.includes("security gap")) {
      extractedNodeId = "adversarial_resistance";
      extractedLabel = "Adversarial Discrepancy Margin";
      extractedType = "gap";
      relationship = "threatens_accuracy";
      extractedDesc = "Safety boundary identifying precision discrepancies when standard models transition back onto volatile scraped source feeds.";
    } else if (textToLower.includes("privacy") || textToLower.includes("homomorphic") || textToLower.includes("encrypt")) {
      extractedNodeId = "homomorphic_confidentiality";
      extractedLabel = "Homomorphic Ingest Privacy";
      extractedType = "technology";
      relationship = "secures_ingest_from";
      extractedDesc = "Cryptographic protocol ensuring research paper pipelines ingest sensitive intelligence vectors in-memory with zero visibility.";
    } else if (textToLower.includes("kalshi") || textToLower.includes("betting") || textToLower.includes("financial")) {
      extractedNodeId = "macro_sentiment_correlation";
      extractedLabel = "Sentiment Micro-correlation";
      extractedType = "concept";
      relationship = "co_references";
      extractedDesc = "Real-time alignment ratio comparing predictive betting pools against academic research velocity indexes.";
    } else {
      // General fallbacks
      extractedNodeId = "sota_autonomous_concept";
      extractedLabel = "SOTA Autonomics Invariant";
      extractedType = "concept";
      relationship = "synthesized_into";
      extractedDesc = "Extracted technological invariant confirming conceptual convergence across active research corpora.";
    }

    // Add node
    const alreadyExists = nodes.some(n => n.id === extractedNodeId);
    if (!alreadyExists) {
      const newNode: KnowledgeGraphNode = {
        id: extractedNodeId,
        label: extractedLabel,
        type: extractedType,
        description: extractedDesc,
        relevanceScore: 90
      };

      setNodes(prev => [...prev, newNode]);
      setNodePositions(prev => ({
        ...prev,
        [extractedNodeId]: { x: 350 + (Math.random() - 0.5) * 120, y: 220 + (Math.random() - 0.5) * 100 }
      }));

      // Add link
      const newLink: KnowledgeGraphLink = {
        source: extractedNodeId,
        target: parentTargetId,
        relationship,
        unexplored: extractedType === "gap"
      };
      setLinks(prev => [...prev, newLink]);
      setSelectedNode(newNode);
    }

    setIsExtracting(false);
    setExtractionResult(`Extracted entity: "${extractedLabel}" connected with relationship "${relationship}" back to network nodes successfully.`);
    setSandboxText("");
  };

  // Assess neighbor connections for custom focus Highlight
  const isLinked = (idA: string, idB: string) => {
    return links.some(l => 
      (l.source === idA && l.target === idB) || 
      (l.source === idB && l.target === idA)
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-805 rounded-xl p-6 flex flex-col gap-6 shadow-2xl relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-3">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-indigo-400" />
          <div>
            <h3 className="font-heading font-semibold text-slate-100 text-sm">
              SOTA Dynamic Knowledge Graph Integration
            </h3>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              AUTONOMIC ENTITY PARSER & BLINDSPOT DETECTION
            </p>
          </div>
        </div>

        {/* Dynamic Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Highlight Gap Toggle button */}
          <button
            onClick={() => setHighlightGapsOnly(!highlightGapsOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              highlightGapsOnly 
                ? "bg-rose-950/40 border border-rose-500/50 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.15)] animate-pulse" 
                : "bg-slate-950 border border-slate-850 text-slate-400 hover:text-white"
            }`}
          >
            <Lightbulb className="h-3.5 w-3.5" />
            <span>{highlightGapsOnly ? "Show All Nodes" : "Identify Unexplored Gaps"}</span>
          </button>

          {/* Reset position buttons */}
          <button
            onClick={handleResetLayout}
            title="Reset coordinates map"
            className="p-1.5 bg-slate-950 border border-slate-850 rounded-lg text-slate-400 hover:text-white transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed -mt-1 max-w-2xl">
        This canvas resolves and maps text publications into formal semantic nodes and causal relationships. Hover over nodes to inspect neighborhood linkages. Drag nodes to restructure visually. Pulses identify unexplored opportunities. 
      </p>

      {/* Main Work split section: SVG Canvas + Control sidebars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* SVG Node Drawing Surface (Occupies 8/12 column) */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-850 rounded-xl overflow-hidden relative min-h-[440px] flex flex-col">
          
          {/* Draggbility Indicator */}
          <div className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-850/50 select-none z-10">
            <Layers className="h-3 w-3" />
            <span>Interactive Mesh View (Drag Nodes)</span>
          </div>

          {/* Background Vector Blueprint Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* SVG canvas */}
          <div 
            ref={containerRef}
            className="flex-1 w-full relative select-none overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#404040" />
                </marker>
                <marker
                  id="arrow-unexplored"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                </marker>
              </defs>

              {/* Render Link Connection curves */}
              {links.map((link, idx) => {
                const sourcePos = nodePositions[link.source];
                const targetPos = nodePositions[link.target];
                if (!sourcePos || !targetPos) return null;

                const isGapLink = link.unexplored || highlightGapsOnly;
                
                // Determine layout emphasis based on hovering/selection
                let isDimmed = hoveredNode !== null && hoveredNode !== link.source && hoveredNode !== link.target;
                if (selectedNode && hoveredNode === null) {
                  isDimmed = selectedNode.id !== link.source && selectedNode.id !== link.target;
                }

                if (highlightGapsOnly && !link.unexplored) {
                  isDimmed = true;
                }

                // Bezier curved vectors for overlapping or aesthetic layouts
                const dx = targetPos.x - sourcePos.x;
                const dy = targetPos.y - sourcePos.y;
                const dr = Math.sqrt(dx * dx + dy * dy) * 1.5; // Controls curvature sweep

                return (
                  <g key={idx}>
                    <path
                      d={`M${sourcePos.x},${sourcePos.y} A${dr},${dr} 0 0,1 ${targetPos.x},${targetPos.y}`}
                      fill="none"
                      stroke={isGapLink ? "#f43f5e" : isDimmed ? "#1F1F1F" : "#404040"}
                      strokeWidth={isGapLink ? 2 : isDimmed ? 0.8 : 1.2}
                      strokeDasharray={isGapLink ? "4 4" : "none"}
                      opacity={isDimmed ? 0.15 : 1}
                      markerEnd={isGapLink ? "url(#arrow-unexplored)" : "url(#arrow)"}
                      className="transition-all duration-300"
                    />
                    
                    {/* Floating Text descriptor inside middle curve path */}
                    {!isDimmed && (
                      <text
                        x={(sourcePos.x + targetPos.x) / 2}
                        y={(sourcePos.y + targetPos.y) / 2 - 4}
                        fill={isGapLink ? "#f43f5e" : "#525252"}
                        fontSize={8}
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="bg-slate-950 font-bold tracking-tighter"
                      >
                        {link.relationship.toUpperCase()}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Interactive Draggable HTML nodes superimposed over SVG positions */}
            {nodes.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;

              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode === node.id;
              const isGapNode = node.type === "gap";

              // Filter out non-gaps if isolated toggle on
              if (highlightGapsOnly && !isGapNode) {
                return null;
              }

              // Assess fading state for dimming
              let isDimmed = hoveredNode !== null && hoveredNode !== node.id && !isLinked(hoveredNode, node.id);
              if (selectedNode && hoveredNode === null) {
                isDimmed = selectedNode.id !== node.id && !isLinked(selectedNode.id, node.id);
              }

              const typeColorClass = getTypeColor(node.type, true);

              return (
                <div
                  key={node.id}
                  style={{
                    position: "absolute",
                    left: pos.x,
                    top: pos.y,
                    transform: "translate(-50%, -50%)"
                  }}
                  onMouseDown={(e) => handleMouseDown(node.id, e)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => handleNodeClick(node)}
                  className={`px-3 py-2 rounded-lg border text-xs font-semibold whitespace-nowrap cursor-pointer transition-all duration-300 z-20 ${
                    isSelected ? "ring-2 ring-indigo-500 scale-105 z-30" : ""
                  } ${
                    isHovered ? "bg-slate-800 scale-102" : "bg-slate-900 border-white/10"
                  } ${
                    isDimmed ? "opacity-30 border-white/5" : "opacity-100"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {/* Tiny Bullet type badge indicator */}
                    <span 
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: getTypeColor(node.type, false) }}
                    />
                    <span className="text-slate-100 font-heading">{node.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Inspection & Auto Extraction Core Sidebars (Occupies 4/12 column) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Box 1: Selected Node Inspection Properties Card */}
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 flex flex-col gap-3.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block border-b border-slate-900 pb-2">
              Concept Registry Auditor
            </span>

            {selectedNode ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                    selectedNode.type === "gap" 
                      ? "bg-rose-950/50 text-rose-300 border border-rose-900/40" 
                      : "bg-slate-900 text-slate-400 border border-slate-800"
                  }`}>
                    {selectedNode.type} Node
                  </span>
                  
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <span>Relevance:</span>
                    <span className="text-indigo-400 font-bold">{selectedNode.relevanceScore || 90}%</span>
                  </div>
                </div>

                <h4 className="font-heading font-bold text-sm text-white leading-tight">
                  {selectedNode.label}
                </h4>

                <p className="text-[11px] text-slate-400 leading-normal bg-slate-900/40 border border-slate-900 p-3 rounded-lg">
                  {selectedNode.description}
                </p>

                {/* Neighbor Link enumeration */}
                <div className="flex flex-col gap-1.5 mt-1 border-t border-slate-900 pt-3">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    Direct Connections:
                  </span>
                  <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                    {links.filter(l => l.source === selectedNode.id || l.target === selectedNode.id).map((l, index) => {
                      const otherNodeId = l.source === selectedNode.id ? l.target : l.source;
                      const otherNode = nodes.find(n => n.id === otherNodeId);
                      return (
                        <div key={index} className="flex justify-between items-center bg-slate-900/50 p-1.5 rounded text-[10px]">
                          <span className="text-slate-350">{otherNode?.label || otherNodeId}</span>
                          <span className="text-indigo-400 font-mono text-[9px] tracking-tighter">
                            {l.relationship.toUpperCase()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
                <HelpCircle className="h-6 w-6 opacity-30" />
                <span>Select a node in the mesh network to audit relationships</span>
              </div>
            )}
          </div>

          {/* Box 2: Auto Extraction Core / manual node injection */}
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 flex flex-col gap-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block border-b border-slate-900 pb-2">
              AI Context Auto-Ingest Sandbox
            </span>

            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-mono text-slate-400 leading-normal">
                Paste any paragraph or text snippet to parse key entities and draw relations automatically:
              </label>
              
              <div className="relative">
                <textarea
                  value={sandboxText}
                  onChange={(e) => setSandboxText(e.target.value)}
                  placeholder="e.g. Exploiting adversarial discrepancies or security gaps on volatile in-vivo homomorphic methylation sequences..."
                  className="w-full bg-slate-900 border border-slate-800 p-2 text-[11px] text-slate-200 rounded-lg h-20 focus:outline-none focus:border-indigo-500 text-left placeholder:text-slate-600 tracking-normal"
                />
              </div>

              <button
                type="button"
                onClick={handleIngestSandboxText}
                disabled={isExtracting || !sandboxText.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isExtracting ? (
                  <>
                    <Cpu className="h-3 w-3 animate-spin" />
                    <span>AI PARSING PIPELINE...</span>
                  </>
                ) : (
                  <>
                    <Beaker className="h-3.5 w-3.5" />
                    <span>Extract Relationships</span>
                  </>
                )}
              </button>

              {extractionResult && (
                <div className="bg-emerald-950/20 border border-emerald-900/50 text-emerald-400 text-[10px] p-2 rounded-lg flex gap-1.5 items-start">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{extractionResult}</span>
                </div>
              )}
            </div>

            {/* Quick manual injector accordion */}
            <div className="border-t border-slate-900 pt-3 mt-1 flex flex-col">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2">
                Quick Manual Entity Injector:
              </span>
              <form onSubmit={handleAddCustomNode} className="flex flex-col gap-2">
                <input
                  type="text"
                  required
                  placeholder="Concept label (e.g., NIST Compliance)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-1.5 text-[10px] text-slate-200 rounded focus:outline-none focus:border-indigo-500"
                />

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="bg-slate-900 border border-slate-800 p-1.5 text-[10px] text-slate-400 rounded focus:outline-none"
                  >
                    <option value="concept">Concept</option>
                    <option value="technology">Technology</option>
                    <option value="organization">Agency</option>
                    <option value="parameter">Parameter</option>
                    <option value="gap">Unexplored Gap</option>
                  </select>

                  <select
                    value={linkTargetId}
                    onChange={(e) => setLinkTargetId(e.target.value)}
                    className="bg-slate-900 border border-slate-800 p-1.5 text-[10px] text-slate-400 rounded focus:outline-none"
                  >
                    <option value="">Link to: (None)</option>
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.label}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 py-1.5 px-3 rounded text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  <span>Map Concept into Graph</span>
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
