export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

export interface KpiMetric {
  id: string;
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
}

export interface ScanEvent {
  id: string;
  timestamp: string;
  type: "INFO" | "WARN" | "ERROR" | "CRITICAL";
  source: string;
  message: string;
}

export interface Vulnerability {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  cvss: number;
  asset: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  discovered: string;
  description: string;
  exploitPayload?: string;
}

export interface Asset {
  id: string;
  hostname: string;
  ip: string;
  riskScore: number;
  technologies: string[];
  ports: { port: number; service: string; state: string }[];
  dnsRecords: { type: string; value: string }[];
  headers: { name: string; value: string }[];
}

export interface WorkerTelemetry {
  id: string;
  name: string;
  status: "idle" | "busy" | "error";
  tasksCompleted: number;
  currentTask?: string;
  cpu: number;
  memory: number;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: "discovery" | "scan" | "vulnerability" | "exploit";
  label: string;
  asset: string;
  status: "completed" | "in_progress" | "pending";
}

export interface UserSession {
  isAuthenticated: boolean;
  operatorId: string;
  clearance: string;
  token: string | null;
}
