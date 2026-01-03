const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DATA_DIR = './data';
const LOG_FILE = path.join(DATA_DIR, 'telemetry.log');

// ensure storage exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// health check (important for Render)
app.get('/health', (_, res) => {
  res.status(200).send('OK');
});

// 🔴 THIS IS THE CRITICAL ENDPOINT
app.post('/api/telemetry', (req, res) => {
  const entry = {
    receivedAt: new Date().toISOString(),
    ...req.body
  };

  console.log('Received telemetry from:', entry.source?.hostname);

  fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n');
  res.status(200).json({ status: 'accepted' });
});

// view stored logs
app.get('/api/telemetry', (req, res) => {
  if (!fs.existsSync(LOG_FILE)) {
    return res.json([]);
  }

  const logs = fs.readFileSync(LOG_FILE, 'utf8')
    .trim()
    .split('\n')
    .map(JSON.parse);

  res.json(logs);
});

app.listen(PORT, () => {
  console.log(`Telemetry server listening on port ${PORT}`);
});

