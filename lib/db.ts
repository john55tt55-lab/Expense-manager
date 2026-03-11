import Database from 'better-sqlite3';
import path from 'path';

// Construct the path to the database file in the project directory
const dbPath = path.join(process.cwd(), 'expense-manager.db');

let db: Database.Database;

try {
  // Opening the database. We use a global variable to avoid multiple instances in development.
  const globalAny: any = global;
  if (!globalAny.db) {
    globalAny.db = new Database(dbPath, { verbose: console.log });
    globalAny.db.pragma('journal_mode = WAL');
    console.log(`Connected to SQLite database at ${dbPath}`);
  }
  db = globalAny.db;
} catch (err) {
  console.error("Failed to connect to the database:", err);
  throw err;
}

export default db;
