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


To run the aagent on that specific machine to monitor and send the stats from  ( later could be tXstream )

``
cd agent
docker build -t telemetry-agent .
docker run -d \
  --restart unless-stopped \
  -e SERVER_URL=https://YOUR-APP.onrender.com/api/telemetry \
  telemetry-agent
``

Optional (recommended)

Create an example env file (commit this):

.env.example

SERVER_URL=https://your-app.onrender.com/api/telemetry


2️⃣ Test API
curl -X POST SERVER_URL \
  -H "Content-Type: application/json" \
  -d '{"source":{"hostname":"render-test"}}'


Expected:

{"status":"accepted"}
