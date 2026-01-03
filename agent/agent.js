const os = require('os');
const axios = require('axios');

const SERVER_URL = process.env.SERVER_URL;

if (!SERVER_URL) {
  console.error('SERVER_URL not set');
  process.exit(1);
}

function collectStats() {
  return {
    source: {
      hostname: os.hostname(),
      platform: os.platform()
    },
    cpu: {
      cores: os.cpus().length,
      load1m: os.loadavg()[0]
    },
    memory: {
      totalMB: Math.round(os.totalmem() / 1024 / 1024),
      usedMB: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024)
    },
    timestamp: new Date().toISOString()
  };
}

async function sendTelemetry() {
  const payload = collectStats();
  console.log('Sending telemetry:', payload);

  try {
    await axios.post(SERVER_URL, payload);
  } catch (err) {
    console.error(
      'Send failed:',
      err.response?.status || err.message
    );
  }
}

setInterval(sendTelemetry, 10000);
sendTelemetry();
