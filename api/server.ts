import express from "express";
import { createDatabase } from './database.js';

const PORT = process.env.PORT || 3000;

const app = express();
const database = createDatabase();
app.use(express.json());

// A quick endpoint example
app.get('/status', (_req, res) => {
  const result = database.prepare('SELECT 1 AS ok').get() as { ok: number };

  res.json({ ok: result.ok === 1, database: 'connected' });
});
app.post('/echo', (req, res) => res.json(req.body));

const server = app.listen(PORT, () =>
  console.log(`API listening on port ${PORT}`));

function shutdown() {
  server.close(() => {
    database.close();
    process.exit(0);
  });
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);