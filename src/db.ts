import sqlite3 from 'sqlite3';
import { promisify } from 'util';

// Initialize SQLite database with async wrapper
export class Database {
  private db: sqlite3.Database;

  constructor(dbPath: string) {
    // Create database connection
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        throw err;
      }
      console.log('Connected to SQLite database');
    });

    // Enable foreign keys for data integrity
    this.db.run('PRAGMA foreign_keys = ON');
    
    // Initialize tables
    this.initializeTables();
  }

  // Create tables if they don't exist
  private initializeTables(): void {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('Items table ready');
      }
    });
  }

  // Get all items from database
  async getAllItems(): Promise<any[]> {
    const query = 'SELECT * FROM items ORDER BY created_at DESC';
    return new Promise((resolve, reject) => {
      this.db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Create a new item
  async createItem(name: string, description?: string): Promise<number> {
    const query = 'INSERT INTO items (name, description) VALUES (?, ?)';
    return new Promise((resolve, reject) => {
      this.db.run(query, [name, description || null], function(err) {
        if (err) reject(err);
        else resolve(this.lastID); // Return the ID of newly created item
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