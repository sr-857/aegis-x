"""Mock backend API for Aegis Reconnaissance Intelligence Suite.
Run with: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import random
import json
from datetime import datetime

app = FastAPI(title="AEGIS Mock API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MOCK_KPIS = [
    {"id": "1", "label": "Total Assets", "value": "2,847", "change": 12.5, "changeLabel": "vs last scan", "icon": "dns"},
    {"id": "2", "label": "Vulnerabilities", "value": "1,234", "change": -8.3, "changeLabel": "vs last scan", "icon": "warning"},
    {"id": "3", "label": "Critical", "value": "89", "change": 3.1, "changeLabel": "new this week", "icon": "dangerous"},
    {"id": "4", "label": "Scan Coverage", "value": "94.2%", "change": 2.1, "changeLabel": "vs last scan", "icon": "radar"},
    {"id": "5", "label": "Active Threats", "value": "23", "change": -15.6, "changeLabel": "vs yesterday", "icon": "shield"},
    {"id": "6", "label": "Avg Response", "value": "1.2s", "change": -5.4, "changeLabel": "improved", "icon": "bolt"},
]

MOCK_SOURCES = ["scanner.node", "enricher.dns", "exploit.engine", "monitor.cert", "analyzer.port"]
MOCK_MESSAGES = [
    "Discovered new subdomain: api.internal",
    "Port 8443 open on 10.0.1.45",
    "TLS certificate expired on mail.internal",
    "CVE-2024-21626 signature matched",
    "DNS A record updated for gateway.prod",
]

@app.get("/api/kpis")
async def get_kpis():
    return MOCK_KPIS

@app.get("/api/scan-events")
async def get_scan_events():
    events = []
    for _ in range(20):
        events.append({
            "id": f"evt-{random.randint(10000, 99999)}",
            "timestamp": datetime.now().isoformat(),
            "type": random.choice(["INFO", "WARN", "ERROR"]),
            "source": random.choice(MOCK_SOURCES),
            "message": random.choice(MOCK_MESSAGES),
        })
    return events

@app.get("/api/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            event = {
                "id": f"evt-{random.randint(10000, 99999)}",
                "timestamp": datetime.now().isoformat(),
                "type": random.choice(["INFO", "WARN", "ERROR", "CRITICAL"]),
                "source": random.choice(MOCK_SOURCES),
                "message": random.choice(MOCK_MESSAGES),
            }
            await websocket.send_json(event)
            await asyncio.sleep(random.uniform(1, 3))
    except:
        pass
