import dotenv from 'dotenv';
import { createApp } from './app';
import { Database } from './db';

// Load environment variables from .env file
dotenv.config();

// Get configuration from environment variables with defaults
const PORT = process.env.PORT || 3000;
const DATABASE_PATH = process.env.DATABASE_PATH || './data/database.sqlite';

// Async function to start the server
// We need this to be async so we can await database initialization
async function startServer() {
  try {
    // Initialize database using the factory method
    // This ensures tables are created before we start accepting requests
    const database = await Database.create(DATABASE_PATH);

    // Create the Express app with the initialized database
    const app = createApp(database);

    // Start listening for requests
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown: close database when server stops
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(async () => {
        await database.close();
        console.log('Database closed, exiting');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
