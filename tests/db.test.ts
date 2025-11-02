import { Database } from '../src/db';
import * as fs from 'fs';

describe('Database', () => {
  let db: Database;
  const testDbPath = './test_database.sqlite';

  beforeEach(async () => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    db = await Database.create(testDbPath);
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
    // Create test items
    await db.createItem('Item 1', 'Description 1');
    await db.createItem('Item 2', 'Description 2');

    // Retrieve all items
    const items = await db.getAllItems();

    // Verify we got both items back
    expect(items).toHaveLength(2);

    // Verify both items are present (order doesn't matter for this test)
    const itemNames = items.map((item) => item.name);
    expect(itemNames).toContain('Item 1');
    expect(itemNames).toContain('Item 2');

    // Verify they have their descriptions
    const item1 = items.find((item) => item.name === 'Item 1');
    const item2 = items.find((item) => item.name === 'Item 2');
    expect(item1?.description).toBe('Description 1');
    expect(item2?.description).toBe('Description 2');
  });

  it('should handle items without description', async () => {
    const itemId = await db.createItem('Item without description');
    expect(itemId).toBeGreaterThan(0);

    const items = await db.getAllItems();
    const item = items.find((i) => i.name === 'Item without description');
    expect(item?.description).toBeNull();
  });
});
