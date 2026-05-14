import type {
  Asset,
  KpiMetric,
  ScanEvent,
  TimelineEvent,
  Vulnerability,
  WorkerTelemetry,
} from "@/types";
import {
  generateScanEvents,
  getDynamicAssets,
  generateDynamicKpis,
  getDynamicTelemetry,
  generateDynamicTimeline,
  getDynamicVulnerabilities,
} from "./mock-data";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class MockService {
  async getKpis(): Promise<KpiMetric[]> {
    await delay(random(150, 350));
    return generateDynamicKpis();
  }

  async getTimeline(): Promise<TimelineEvent[]> {
    await delay(random(200, 400));
    return generateDynamicTimeline();
  }

  async getVulnerabilities(): Promise<Vulnerability[]> {
    await delay(random(200, 400));
    return getDynamicVulnerabilities();
  }

  async getVulnerability(id: string): Promise<Vulnerability | undefined> {
    await delay(random(100, 250));
    const vulns = getDynamicVulnerabilities();
    return vulns.find((v) => v.id === id);
  }

  async getAssets(): Promise<Asset[]> {
    await delay(random(200, 400));
    return getDynamicAssets();
  }

  async getAsset(id: string): Promise<Asset | undefined> {
    await delay(random(150, 300));
    const assets = getDynamicAssets();
    return assets.find((a) => a.id === id);
  }

  async getTelemetry(): Promise<WorkerTelemetry[]> {
    await delay(random(100, 250));
    return getDynamicTelemetry();
  }

  async getScanEvents(count = 25): Promise<ScanEvent[]> {
    await delay(random(100, 250));
    return generateScanEvents(count);
  }

  subscribeScanEvents(
    callback: (event: ScanEvent) => void,
    intervalMs = 1500
  ): () => void {
    const interval = setInterval(() => {
      const events = generateScanEvents(1);
      callback(events[0]);
    }, intervalMs);
    return () => clearInterval(interval);
  }

  subscribeTelemetry(
    callback: (telemetry: WorkerTelemetry[]) => void,
    intervalMs = 3000
  ): () => void {
    const interval = setInterval(async () => {
      const data = await this.getTelemetry();
      callback(data);
    }, intervalMs);
    return () => clearInterval(interval);
  }

  async authenticate(
    operatorId: string,
    clearanceKey: string
  ): Promise<{ token: string }> {
    await delay(random(600, 1200));
    if (clearanceKey.length < 4) {
      throw new Error("Invalid clearance credentials.");
    }
    return { token: `mock-token-${Date.now()}-${random(1000, 9999)}` };
  }

  async getDashboardSummary(): Promise<{
    kpis: KpiMetric[];
    timeline: TimelineEvent[];
    recentEvents: ScanEvent[];
  }> {
    await delay(random(200, 400));
    return {
      kpis: generateDynamicKpis(),
      timeline: generateDynamicTimeline(),
      recentEvents: generateScanEvents(8),
    };
  }
}

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const mockService = new MockService();