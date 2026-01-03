const os = require('os');
const axios = require('axios');

const SERVER_URL = process.env.SERVER_URL
  || 'https://pixeltracker-kkl9.onrender.com/api/telemetry';

const INTERVAL_MS = 10_000;

// extensible stats collector
function collectStats() {
  return {
    source: {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch()
    },
    cpu: {
      cores: os.cpus().length,
      load1m: os.loadavg()[0]
    },
    memory: {
      totalMB: Math.round(os.totalmem() / 1024 / 1024),
      usedMB: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024)
    },
    disk: {
      freeMB: 50400 // placeholder (future extension)
    },
    timestamp: new Date().toISOString()
  };
}

async function sendTelemetry() {
  const payload = collectStats();
  console.log('Sending telemetry:', payload);

  try {
    await axios.post(SERVER_URL, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    if (err.response) {
      console.error(
        'Telemetry failed:',
        err.response.status,
        err.response.data
      );
    } else {
      console.error('Telemetry error:', err.message);
    }
  }
}

setInterval(sendTelemetry, INTERVAL_MS);
sendTelemetry(); // send immediately on start

