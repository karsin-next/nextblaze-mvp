import Database from "better-sqlite3";
import path from "path";

const DB_FILENAME = "fundability.db";
const DEFAULT_PATH = path.join(process.cwd(), DB_FILENAME);
const FALLBACK_PATH = path.join("/tmp", DB_FILENAME);

let db: Database.Database;

export function getDb() {
  if (!db) {
    let selectedPath = process.env.DATABASE_PATH || DEFAULT_PATH;
    
    console.log(`[DB] Initializing database...`);
    console.log(`[DB] Attempting path: ${selectedPath}`);

    try {
      // Try initialization at selected path
      db = new Database(selectedPath);
    } catch (err: any) {
      console.error(`[DB] Failed to initialize at ${selectedPath}: ${err.message}`);
      
      if (selectedPath !== FALLBACK_PATH) {
        console.log(`[DB] Retrying with fallback path: ${FALLBACK_PATH}`);
        try {
          db = new Database(FALLBACK_PATH);
          selectedPath = FALLBACK_PATH;
        } catch (fallbackErr: any) {
          console.error(`[DB] Critical: Fallback also failed: ${fallbackErr.message}`);
          throw fallbackErr;
        }
      } else {
        throw err;
      }
    }

    console.log(`[DB] Successfully opened database at: ${selectedPath}`);
    
    try {
      db.pragma("journal_mode = WAL");
      db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'startup',
        fundability_score INTEGER DEFAULT 0,
        bank_connected INTEGER DEFAULT 0,
        last_data_sync TEXT,
        data_quality_score INTEGER DEFAULT 0,
        data_consent INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS startup_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        mrr REAL DEFAULT 0,
        burn_rate REAL DEFAULT 0,
        runway_months REAL DEFAULT 0,
        ltv REAL DEFAULT 0,
        cac REAL DEFAULT 0,
        gross_margin REAL DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      CREATE TABLE IF NOT EXISTS investor_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        fund_name TEXT DEFAULT '',
        focus_geography TEXT DEFAULT '',
        focus_industry TEXT DEFAULT '',
        min_score INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      CREATE TABLE IF NOT EXISTS audit_sessions (
        session_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'in_progress', -- in_progress, completed
        current_sub_module TEXT DEFAULT '1-problem',
        started_at TEXT DEFAULT (datetime('now')),
        completed_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      CREATE TABLE IF NOT EXISTS audit_responses (
        response_id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        question_id TEXT NOT NULL,
        answer_value TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (session_id) REFERENCES audit_sessions(session_id)
      );
      CREATE TABLE IF NOT EXISTS question_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        session_id INTEGER NOT NULL,
        sub_module_id TEXT NOT NULL,
        question_id TEXT NOT NULL,
        answer_data TEXT NOT NULL, -- JSON string for complex answers
        time_spent_ms INTEGER,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (session_id) REFERENCES audit_sessions(session_id)
      );
      CREATE TABLE IF NOT EXISTS ai_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        module_id TEXT NOT NULL,
        prompt_type TEXT NOT NULL,
        input_prompt TEXT NOT NULL,
        output_response TEXT NOT NULL,
        user_feedback TEXT, -- 'thumbs_up', 'thumbs_down', or NULL
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      CREATE TABLE IF NOT EXISTS score_snapshots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        session_id INTEGER NOT NULL,
        overall_score INTEGER NOT NULL,
        category_scores TEXT NOT NULL,
        algorithm_version TEXT DEFAULT 'v1.0',
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      CREATE TABLE IF NOT EXISTS financial_connections (
        connection_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        provider_type TEXT NOT NULL, -- 'csv' or 'accounting'
        provider_name TEXT NOT NULL,
        status TEXT NOT NULL,
        connected_at TEXT DEFAULT (datetime('now')),
        last_sync_at TEXT,
        disconnected_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      CREATE TABLE IF NOT EXISTS transactions (
        transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        connection_id INTEGER NOT NULL,
        external_id TEXT,
        date TEXT NOT NULL,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT,
        user_category TEXT,
        is_revenue INTEGER DEFAULT 0,
        is_expense INTEGER DEFAULT 0,
        metadata TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (connection_id) REFERENCES financial_connections(connection_id)
      );
      CREATE TABLE IF NOT EXISTS monthly_metrics (
        metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        month_date TEXT NOT NULL,
        revenue REAL DEFAULT 0,
        expenses REAL DEFAULT 0,
        burn_rate REAL DEFAULT 0,
        runway_months REAL DEFAULT 0,
        new_customers INTEGER DEFAULT 0,
        churned_customers INTEGER DEFAULT 0,
        cac REAL DEFAULT 0,
        ltv REAL DEFAULT 0,
        gross_margin REAL DEFAULT 0,
        calculation_method TEXT DEFAULT 'ai',
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      CREATE TABLE IF NOT EXISTS metric_overrides (
        override_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        metric_type TEXT NOT NULL,
        period_start TEXT,
        period_end TEXT,
        user_value REAL NOT NULL,
        ai_value REAL,
        reason TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);
    } catch (execErr: any) {
      console.error(`[DB] Error executing schema: ${execErr.message}`);
      throw execErr;
    }
  }
  return db;
}
