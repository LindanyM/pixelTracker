const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

const LOG_FILE = "./telemetry.log";

app.post('/api/telemetry', (req, res) => {
  const entry = { ...req.body, receivedAt: new Date() };
  console.log("Received telemetry:", entry);

  fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + "\n");
  res.send({ status: "ok" });
});

app.get('/api/logs', (req, res) => {
  const logs = fs.readFileSync(LOG_FILE, 'utf8')
    .trim()
    .split("\n")
    .map(JSON.parse);

  res.json(logs);
});

app.listen(3000, () => console.log("Telemetry server running"));

