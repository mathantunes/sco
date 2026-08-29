import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

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
  `);

  return database;
}