/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Citation {
  id: number;
  title: string;
  url: string;
  publisher: string;
  publishDate: string;
  snippet: string;
  trustRating: number;
  hashSignature: string;
}

export interface Bibliography {
  apa: string[];
  mla: string[];
  ieee: string[];
}

export interface VisualDataset {
  label: string;
  value: number;
  growth: number;
  relevance: number;
}

export interface TimelineEvent {
  date: string;
  event: string;
  description: string;
}

export interface ResearchGrade {
  completeness: number; // 0-100
  accuracy: number; // 0-100
  credibility: number; // 0-100
  biasRisk: "Low" | "Medium" | "High";
  overallScore: number; // 0-100
  feedback: string;
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: "concept" | "technology" | "organization" | "parameter" | "gap";
  description?: string;
  relevanceScore?: number; // 0-100
}

export interface KnowledgeGraphLink {
  source: string;
  target: string;
  relationship: string;
  unexplored?: boolean;
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  links: KnowledgeGraphLink[];
}

export interface AgentCooperationNode {
  name: string;
  role: string;
  description: string;
  status: "idle" | "processing" | "waiting" | "completed";
  findingsCount: number;
}

export interface AgentMessage {
  id: string;
  fromAgent: string;
  toAgent: string;
  content: string;
  timestamp: string;
  contextArtifact?: string;
}

export interface AgentCooperation {
  agents: AgentCooperationNode[];
  messages: AgentMessage[];
}

export interface DeepResearchResult {
  topic: string;
  domain: string;
  meta: {
    engine: string;
    timestamp: string;
    elapsedMs: number;
    trustScore: number;
  };
  executiveSummary: string;
  reportMarkdown: string;
  citations: Citation[];
  bibliography: Bibliography;
  datasets: VisualDataset[];
  timeline: TimelineEvent[];
  gradeReport: ResearchGrade;
  knowledgeGraph?: KnowledgeGraph;
  agentCooperation?: AgentCooperation;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  agentName: "Search Grounder" | "Scatter-Gather Normalizer" | "Synthesis Resolver" | "Trust-Gate Guard";
  action: string;
  status: "pending" | "success" | "warning" | "error";
  details?: string;
}

// Agentic Workspace Routing Types
export interface WorkspaceQueryIntent {
  rawCommand: string;
  predictedAction: "schedule" | "draft_email" | "create_todo" | "synthesize_threads" | "unknown";
  confidence: number;
  parameters: {
    title?: string;
    recipient?: string;
    time?: string;
    bodySummary?: string;
    priority?: "low" | "medium" | "high";
    conflicts?: Array<{ event: string; time: string; reason: string }>;
  };
  lockStatus: "unlocked" | "locked_pending" | "approved" | "rejected";
}
