import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

if (!OPENWEATHER_API_KEY) {
  console.error('Missing OPENWEATHER_API_KEY in environment');
}

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Proxy for current weather
app.get('/api/weather', async (req, res) => {
  const { q, units = 'metric' } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing query param q' });
  try {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(q)}&appid=${OPENWEATHER_API_KEY}&units=${encodeURIComponent(units)}`;
    const response = await fetch(url);
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Proxy error' });
  }
});

// Proxy for forecast
app.get('/api/forecast', async (req, res) => {
  const { q, units = 'metric' } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing query param q' });
  try {
    const url = `${BASE_URL}/forecast?q=${encodeURIComponent(q)}&appid=${OPENWEATHER_API_KEY}&units=${encodeURIComponent(units)}`;
    const response = await fetch(url);
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Proxy error' });
  }
});

// Serve static files
app.use(express.static(__dirname));

// Root: serve the main HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'weather.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


