import sqlite3 from 'sqlite3';

export interface Item {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

export class Database {
  private db: sqlite3.Database;

  // Private constructor - can only be called from within this class
  // This prevents direct instantiation with 'new Database()'
  private constructor(dbPath: string) {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        throw err;
      }
      console.log('Connected to SQLite database');
    });

    // Enable foreign keys for data integrity
    this.db.run('PRAGMA foreign_keys = ON');
  }

  // Static factory method - this is how you should create Database instances
  // It's async, so it can wait for initialization to complete
  static async create(dbPath: string): Promise<Database> {
    const database = new Database(dbPath);
    await database.initializeTables();
    return database;
  }

  // Create tables if they don't exist
  // Now returns a Promise so we can wait for completion
  private initializeTables(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    return new Promise((resolve, reject) => {
      this.db.run(createTableQuery, (err) => {
        if (err) {
          console.error('Error creating table:', err);
          reject(err);
        } else {
          console.log('Items table ready');
          resolve();
        }
      });
    });
  }

  // Get all items from database
  async getAllItems(): Promise<Item[]> {
    const query = 'SELECT * FROM items ORDER BY created_at DESC';
    return new Promise((resolve, reject) => {
      this.db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Item[]);
      });
    });
  }

  // Create a new item
  async createItem(name: string, description?: string): Promise<number> {
    const query = 'INSERT INTO items (name, description) VALUES (?, ?)';
    return new Promise((resolve, reject) => {
      this.db.run(query, [name, description || null], function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  // Close database connection
  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
