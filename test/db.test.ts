import { Database } from '../src/db';
import * as fs from 'fs';

describe('Database', () => {
  let db: Database;
  const testDbPath = './test_database.sqlite';

  beforeEach(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    db = new Database(testDbPath);
  });

  afterEach(async () => {
    await db.close();
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  afterEach(async () => {
    await db.close();

    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  it('should create a new item', async () => {
    const itemId = await db.createItem('Test Item', 'Test Description');
    expect(itemId).toBeGreaterThan(0);
  });

  it('should retrieve all items', async () => {
    await db.createItem('Item 1', 'Description 1');
    await db.createItem('Item 2', 'Description 2');

    const items = await db.getAllItems();
    expect(items.length).toHaveLength(2);
    expect(items[0].name).toBe('Item 2');
  });

  it('should handle items without description', async () => {
    const itemId = await db.createItem('Item without description');
    expect(itemId).toBeGreaterThan(0);

    const items = await db.getAllItems();
    expect(items[0].description).toBeNull();
  });
});
