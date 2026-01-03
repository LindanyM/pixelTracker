const os = require('os');
const axios = require('axios');

const SERVER_URL = "https://your-hosted-server.onrender.com/api/telemetry";

function collectStats() {
  return {
    name: os.hostname(),
    cpuC: os.cpus().length,
    cpuL: Math.round(os.loadavg()[0] * 10),
    tRam: Math.round(os.totalmem() / 1024 / 1024),
    uRam: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024),
    disk: 50400,
    timestamp: new Date().toISOString()
  };
}

async function sendTelemetry() {
  const stats = collectStats();
  console.log("Sending telemetry:", stats);

  try {
    await axios.post(SERVER_URL, stats);
  } catch (err) {
    console.error("Failed to send telemetry:", err.message);
  }
}

// send every 10 seconds
setInterval(sendTelemetry, 10000);

