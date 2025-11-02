import dotenv from 'dotenv';
import { createApp } from './app';
import { Database } from './db';

// Load environment variables from .env file
dotenv.config();

// Get configuration from environment variables with defaults
const PORT = process.env.PORT || 3000;
const DATABASE_PATH = process.env.DATABASE_PATH || './data/database.sqlite';

// Initialize database
const database = new Database(DATABASE_PATH);

// Create and start the Express app
const app = createApp(database);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown: close database connection when server stops
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await database.close();
    process.exit(0);
  });
});
