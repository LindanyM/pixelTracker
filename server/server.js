const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const LOG_FILE = path.join(DATA_DIR, 'telemetry.log');

// ensure storage exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// health check (Render requires this)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// RECEIVE telemetry
app.post('/api/telemetry', (req, res) => {
  const entry = {
    receivedAt: new Date().toISOString(),
    ...req.body
  };

  console.log('Telemetry from:', entry.source?.hostname || 'unknown');

  fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n');
  res.status(200).json({ status: 'accepted' });
});

// VIEW telemetry
app.get('/api/telemetry', (req, res) => {
  if (!fs.existsSync(LOG_FILE)) return res.json([]);
  const logs = fs.readFileSync(LOG_FILE, 'utf8')
    .trim()
    .split('\n')
    .map(JSON.parse);
  res.json(logs);
});

app.listen(PORT, () => {
  console.log(`Telemetry server listening on ${PORT}`);
});
