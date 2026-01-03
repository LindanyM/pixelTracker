📊 pixelTracker

pixelTracker is a lightweight telemetry system designed to collect system statistics from machines (via a local Docker agent) and send them to a hosted server endpoint accessible anywhere.

📁 Project Structure
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

🚀 Server (Hosted)

Deploy only the server/ folder to Render

This exposes a public endpoint for receiving telemetry

The server is reachable from anywhere

🐳 Agent (Local / Machine Monitoring)

To run the agent on a specific machine and send stats to the hosted server
(later this can be extended to platforms like Txstream)

Build and run the agent
cd agent
docker build -t telemetry-agent .
docker run -d \
  --restart unless-stopped \
  -e SERVER_URL=https://YOUR-APP.onrender.com/api/telemetry \
  telemetry-agent


The agent runs in the background and continuously sends telemetry data to the server.

⚙️ Environment Variables (Optional – Recommended)

Create an example environment file and commit it:

.env.example
SERVER_URL=https://your-app.onrender.com/api/telemetry


This documents required configuration without exposing secrets.

🧪 Testing the API

You can manually test the telemetry endpoint using curl:

curl -X POST SERVER_URL \
  -H "Content-Type: application/json" \
  -d '{"source":{"hostname":"render-test"}}'

Expected response
{"status":"accepted"}

📌 Notes

The server runs as a Node.js web service on Render

The agent runs in Docker on any machine you want to monitor

Future telemetry types can be added without changing the architecture
