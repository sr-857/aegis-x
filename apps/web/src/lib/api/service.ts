import { mockService } from "./mock-service";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

class ApiService {
  private baseUrl = API_BASE;

  private async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    if (USE_MOCK) {
      return this.mockFetch<T>(endpoint, options);
    }
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  }

  private async mockFetch<T>(
    endpoint: string,
    _options?: RequestInit
  ): Promise<T> {
    const route = endpoint.split("?")[0];

    if (route === "/api/kpis") return mockService.getKpis() as Promise<T>;
    if (route === "/api/timeline") return mockService.getTimeline() as Promise<T>;
    if (route === "/api/vulnerabilities")
      return mockService.getVulnerabilities() as Promise<T>;
    if (route.startsWith("/api/vulnerabilities/")) {
      const id = route.split("/").pop()!;
      return mockService.getVulnerability(id) as Promise<T>;
    }
    if (route === "/api/assets") return mockService.getAssets() as Promise<T>;
    if (route.startsWith("/api/assets/")) {
      const id = route.split("/").pop()!;
      return mockService.getAsset(id) as Promise<T>;
    }
    if (route === "/api/telemetry")
      return mockService.getTelemetry() as Promise<T>;
    if (route === "/api/scan-events")
      return mockService.getScanEvents() as Promise<T>;
    if (route === "/api/dashboard")
      return mockService.getDashboardSummary() as Promise<T>;

    throw new Error(`Mock route not found: ${endpoint}`);
  }

  get<T>(endpoint: string) {
    return this.fetch<T>(endpoint);
  }

  post<T>(endpoint: string, body: unknown) {
    return this.fetch<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  subscribeToEvents(
    callback: (event: unknown) => void
  ): () => void {
    if (USE_MOCK) {
      return mockService.subscribeScanEvents(callback as (event: import("@/types").ScanEvent) => void);
    }
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout | undefined;

    const connect = () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws");
      ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          callback(data);
        } catch {
          callback(msg.data);
        }
      };
      ws.onerror = () => {
        if (ws) ws.close();
      };
      ws.onclose = (event) => {
        if (event.code !== 1000) {
          reconnectTimer = setTimeout(connect, 3000);
        }
      };
    };
    connect();
    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) ws.close(1000);
    };
  }
}

export const api = new ApiService();