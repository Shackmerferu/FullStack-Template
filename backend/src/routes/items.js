const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

// Path to the JSON file containing all items data
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Reads and parses the items data from the JSON file
// Returns a Promise that resolves to the parsed items array
async function readData() {
  const raw = await fs.readFile(DATA_PATH, 'utf-8'); // Async read file contents
  return JSON.parse(raw); // Parse JSON string to object
}

// Writes the provided data array back to the JSON file
// Formats the JSON with proper indentation for readability
async function writeData(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
}

// Route: GET /api/items
// Retrieves a paginated and optionally filtered list of items
// Supports query parameters:
// - limit: Number of items per page (default: 50)
// - page: Page number (default: 1)
// - q: Search term to filter items by name
router.get('/', async (req, res, next) => {
  try {
    const data = await readData(); // Read all items
    const { limit = 50, page = 1, q } = req.query; // Extract query params with defaults
    let results = data;

    if (q) {
      const query = q.toLowerCase(); // Normalize search term
      results = results.filter(item =>
        item.name && typeof item.name === 'string' && item.name.toLowerCase().includes(query) // Filter by name substring
      );
    }

    const total = results.length;
    const start = (parseInt(page) - 1) * parseInt(limit); // Calculate slice start index
    const end = start + parseInt(limit); // Calculate slice end index
    const paginated = results.slice(start, end); // Slice for pagination

    res.json({ items: paginated, total }); // Respond with paginated data and total count
  } catch (err) {
    next(err); // Forward error to Express error handler
  }
});

// Route: GET /api/items/:id
// Retrieves a single item by its ID
// Returns 404 if the item is not found
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id)); // Find item by numeric id
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404; // Not found error status
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Route: POST /api/items
// Creates a new item with an auto-generated ID
// Expects item data in the request body
// Returns the created item with status 201
router.post('/', async (req, res, next) => {
  try {
    const item = req.body; // Assume JSON body parsed by middleware
    const data = await readData();
    item.id = Date.now(); // Use timestamp as unique id (simple but may collide)
    data.push(item); // Add new item
    await writeData(data); // Save updated data
    res.status(201).json(item); // Return created item with HTTP 201
  } catch (err) {
    next(err);
  }
});

module.exports = router;
