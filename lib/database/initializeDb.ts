import * as SQLite from "expo-sqlite";


export const initDBAsync = async () => {
  const db = await SQLite.openDatabaseAsync("life_streak.db");
  return db;
};

const CREATE_TASKS_TABLE = `
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  schedule_type TEXT NOT NULL,
  schedule_days TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  total_days INTEGER NOT NULL,
  time_start TEXT NOT NULL,
  time_end TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
`;

const CREATE_OCCURRENCES_TABLE = `
CREATE TABLE IF NOT EXISTS task_occurrences (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL,
  checked_at INTEGER,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  UNIQUE(task_id, date)
);
`;

export const runAsync = async (
  db: SQLite.SQLiteDatabase,
  sql: string,
): Promise<void> => {
    try{
  await db.withTransactionAsync(async () => {
    await db.execAsync(sql);
  });}
  catch(error) {
    console.error('error persisting task', error)
  }
};



export const initializeDatabaseAsync = async (db: SQLite.SQLiteDatabase) => {
  try {
    await runAsync(db, CREATE_TASKS_TABLE);
    await runAsync(db, CREATE_OCCURRENCES_TABLE);
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Error initializing database", err);
    throw err;
  }
};
