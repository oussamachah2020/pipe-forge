import express, { Request, Response, NextFunction } from 'express';
import { Database } from './db';

// Create Express application
export function createApp(database: Database) {
  const app = express();

  // Middleware to parse JSON request bodies
  app.use(express.json());

  // Health check endpoint - useful for monitoring
  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get all items
  app.get('/items', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await database.getAllItems();
      res.json({ success: true, data: items, count: items.length });
    } catch (error) {
      next(error); // Pass error to error handler
    }
  });

  // Create a new item
  app.post(
    '/items',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { name, description } = req.body;

        // Validate input
        if (!name || typeof name !== 'string') {
          res.status(400).json({
            success: false,
            error: 'Name is required and must be a string',
          });
          return;
        }

        const itemId = await database.createItem(name, description);
        res.status(201).json({
          success: true,
          data: { id: itemId, name, description },
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // Error handling middleware - catches all errors
  app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: err.message,
    });
  });

  return app;
}
