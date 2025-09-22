const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON body
app.use(express.json());

// Sample data (in a real application, this would come from a database)
let items = [
    { id: 1, name: 'Item A' },
    { id: 2, name: 'Item B' }
];

// GET all items
app.get('/items', (req, res) => {
    res.json(items);
});

// GET a specific item by ID
app.get('/items/:id', (req, res) => {
    console.log(`GET REQUEST`);
    const id = parseInt(req.params.id);
    const item = items.find(item => item.id === id);
    if (item) {
        res.setHeader('Access-Control-Allow-Origin', '*'); // Or '*' for all origins
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.json(item);
    } else {
        res.status(404).send('Item not found');
    }
});

// POST a new item
app.post('/items', (req, res) => {
    try{
    console.log(`POST REQUEST`);
    console.log(`tha body: ${req}`);

    req.keys(req).forEach(key => {
      console.log(`${key}: ${req[key]}`);
    });
    console.log(`tha body: ${req.data}`);
    console.log(`tha body: ${req.body}`);
    const newItem = req.body;
    newItem.id = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    items.push(newItem);
    res.status(201).json(newItem);
    }
    catch(error){
        console.log(`tha body: ${req.data}`);
        console.error(error);
        }
});

// PUT (update) an existing item
app.put('/items/:id', (req, res) => {
    console.log(`PUT REQUEST`);
    console.log(`${req.body}`);
    const id = parseInt(req.params.id);
    const updatedItem = req.body;
    let foundIndex = items.findIndex(item => item.id === id);
    if (foundIndex !== -1) {
        items[foundIndex] = { ...items[foundIndex], ...updatedItem, id: id };
        res.json(items[foundIndex]);
    } else {
        res.status(404).send('Item not found');
    }
});

// DELETE an item
app.delete('/items/:id', (req, res) => {
    console.log(`DEL REQUEST`);
    const id = parseInt(req.params.id);
    const initialLength = items.length;
    items = items.filter(item => item.id !== id);
    if (items.length < initialLength) {
        res.status(204).send(); // No content
    } else {
        res.status(404).send('Item not found');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});