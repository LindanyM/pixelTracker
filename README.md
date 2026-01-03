# 📊 pixelTracker

![Node.js](https://img.shields.io/badge/node-%3E%3D18-green)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![Render](https://img.shields.io/badge/hosted%20on-render-purple)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

`pixelTracker` is a lightweight telemetry system that collects system statistics from machines (via a local Docker agent) and sends them to a hosted server endpoint that is accessible anywhere.

It is designed to be **simple**, **portable**, and **extensible** — today for basic system stats, tomorrow for any telemetry source (e.g. Txstream, application metrics, custom sensors).

---

## 📁 Project Structure

```text
pixelTracker/
│
├── server/                 👈 DEPLOY THIS TO RENDER
│   ├── server.js
│   ├── package.json
│   └── .gitignore
│
├── agent/                  👈 RUN THIS IN DOCKER (LOCALLY)
│   ├── agent.js
│   ├── Dockerfile
│   └── package.json
│
└── README.md


┌─────────────────────┐
│   Local Machine     │
│                     │
│  Docker Agent       │
│  (agent.js)         │
│                     │
│  - Collects stats   │
│  - Runs background  │
│                     │
└─────────┬───────────┘
          │  HTTP POST
          ▼
┌────────────────────────────┐
│ Hosted Telemetry Server    │
│ (Render / Free Tier)       │
│                            │
│  /api/telemetry            │
│                            │
│  - Accepts telemetry       │
│  - Logs / stores data      │
│  - Ready for dashboards    │
└────────────────────────────┘

```

# 🚀 Server (Hosted on Render)
## What gets deployed
- Only the server/ folder
- Runs as a Node.js Web Service
- Must bind to process.env.PORT

## Purpose
- Receives telemetry from agents
- Exposes a public endpoint:

``` POST /api/telemetry```
- Can later store data in files or databases

# 🐳 Agent (Local / Machine Monitoring)
The agent runs on any machine you want to monitor.
- Runs in Docker
- Sends telemetry to the hosted server
- Runs silently in the background
- Auto-restarts if the machine reboots

▶️ Build and run the agent
```
cd agent
docker build -t telemetry-agent .
docker run -d \
  --restart unless-stopped \
  -e SERVER_URL=https://YOUR-APP.onrender.com/api/telemetry \
  telemetry-agent
```
✅ The agent will immediately start sending telemetry
✅ No open ports required on the local machine

# ⚙️ Environment Variables (Recommended)
Create and commit an example environment file:

.env.example
```SERVER_URL=https://your-app.onrender.com/api/telemetry```
This documents required configuration without exposing secrets.

# 🔌 API Specification
Endpoint
``` http
POST /api/telemetry
```

Headers
```http
Copy code
Content-Type: application/json
```

Payload (example)
```json
Copy code
{
  "name": "my-server",
  "cpuC": 8,
  "cpuL": 63,
  "tRam": 31387,
  "uRam": 16382,
  "disk": 50400,
  "timestamp": "2026-01-03T07:26:04.820Z"
}
```

Response
```json
Copy code
{
  "status": "accepted"
}
```

🧪 Test the API Manually
You can test the server without Docker using curl:

```
curl -X POST https://your-app.onrender.com/api/telemetry \
  -H "Content-Type: application/json" \
  -d '{"source":{"hostname":"render-test"}}'
```

Expected Response
json
```
{"status":"accepted"}
```

# 📈 Future Roadmap
Planned extensions (no architecture changes needed):

- 📊 Persistent storage (SQLite / PostgreSQL)
- 📉 Grafana / dashboard UI
- 🔔 Alerts & thresholds
- 🔐 API authentication
- 🧩 Plugin-based telemetry sources
- 🌐 Txstream / external metric sources

# 📝 License
MIT License — free to use, modify, and distribute.

# 🙌 Author
Built by Lindani Mabaso, James Eckhardt
Software Engineer • Cloud • Backend • Systems

