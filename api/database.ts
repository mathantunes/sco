import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export type AppDatabase = DatabaseSync;

const defaultDatabasePath = resolve(process.cwd(), 'data', 'snack-bar.db');

export function createDatabase() {
  const databasePath = resolve(process.env.DB_FILE ?? defaultDatabasePath);

  mkdirSync(dirname(databasePath), { recursive: true });

  const database = new DatabaseSync(databasePath);
  database.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS schema_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      device_id TEXT NOT NULL,
      store_id TEXT NOT NULL,
      kind TEXT NOT NULL CHECK (kind IN ('open', 'paid', 'abandoned')),
      total_amount TEXT NOT NULL DEFAULT '0.00',
      currency TEXT NOT NULL DEFAULT 'USD',
      created_at TEXT NOT NULL,
      paid_at TEXT,
      abandoned_at TEXT
    );

    CREATE TABLE IF NOT EXISTS order_items (
      order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      product_price_amount TEXT NOT NULL,
      product_price_currency TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      PRIMARY KEY (order_id, id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      order_id TEXT PRIMARY KEY REFERENCES orders(id) ON DELETE CASCADE,
      transaction_id TEXT NOT NULL UNIQUE,
      amount TEXT NOT NULL,
      currency TEXT NOT NULL,
      paid_at TEXT NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS one_open_order_per_device
      ON orders(device_id) WHERE kind = 'open';
  `);

  return database;
}