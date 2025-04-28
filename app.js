import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// In-memory data storage
let items = [];
let users = [];

// Routes
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'html', 'index.html'));
});

// Items endpoints
app.post('/api/items', (req, res) => {
    console.log('POST /api/items - Request body:', req.body);
    const newItems = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    for (const item of newItems) {
        if (!item.id || !item.name || !item.type || !item.effect) {
            console.log(`Failed to add item: Missing required fields for item ${item.id || 'unknown'}`);
            results.push({ success: false, message: 'Missing required fields' });
            continue;
        }

        if (items.some(i => i.id === item.id)) {
            console.log(`Failed to add item: Item with ID ${item.id} already exists`);
            results.push({ success: false, message: `Item with ID ${item.id} already exists` });
            continue;
        }

        items.push(item);
        console.log(`Successfully added item: ${item.id}`);
        results.push({ success: true, message: `Item ${item.id} added successfully` });
    }

    console.log('POST /api/items - Response:', results);
    res.status(200).json(results);
});

app.get('/api/items', (req, res) => {
    console.log('GET /api/items - Request received');
    if (items.length === 0) {
        console.log('GET /api/items - No items found');
        res.status(404).json({ message: 'No items found' });
        return;
    }
    console.log('GET /api/items - Returning items:', items);
    res.json(items);
});

app.get('/api/items/:id', (req, res) => {
    console.log(`GET /api/items/${req.params.id} - Request received`);
    const item = items.find(i => i.id === req.params.id);
    if (!item) {
        console.log(`GET /api/items/${req.params.id} - Item not found`);
        res.status(404).json({ message: 'Item not found' });
        return;
    }
    console.log(`GET /api/items/${req.params.id} - Returning item:`, item);
    res.json(item);
});

app.delete('/api/items/:id', (req, res) => {
    console.log(`DELETE /api/items/${req.params.id} - Request received`);
    const index = items.findIndex(i => i.id === req.params.id);
    if (index === -1) {
        console.log(`DELETE /api/items/${req.params.id} - Item not found`);
        res.status(404).json({ message: 'Item not found' });
        return;
    }
    items.splice(index, 1);
    console.log(`DELETE /api/items/${req.params.id} - Item deleted successfully`);
    res.json({ message: 'Item deleted successfully' });
});

app.put('/api/items/:id', (req, res) => {
    console.log(`PUT /api/items/${req.params.id} - Request body:`, req.body);
    const index = items.findIndex(i => i.id === req.params.id);
    if (index === -1) {
        console.log(`PUT /api/items/${req.params.id} - Item not found`);
        res.status(404).json({ message: 'Item not found' });
        return;
    }

    const updatedItem = { ...items[index], ...req.body };
    items[index] = updatedItem;
    console.log(`PUT /api/items/${req.params.id} - Item updated successfully:`, updatedItem);
    res.json(updatedItem);
});

// Users endpoints
app.post('/api/users', (req, res) => {
    console.log('POST /api/users - Request body:', req.body);
    const newUsers = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    for (const user of newUsers) {
        if (!user.id || !user.name || !user.email) {
            console.log(`Failed to add user: Missing required fields for user ${user.id || 'unknown'}`);
            results.push({ success: false, message: 'Missing required fields' });
            continue;
        }

        if (users.some(u => u.id === user.id)) {
            console.log(`Failed to add user: User with ID ${user.id} already exists`);
            results.push({ success: false, message: `User with ID ${user.id} already exists` });
            continue;
        }

        if (user.items) {
            const invalidItems = user.items.filter(itemId => !items.some(i => i.id === itemId));
            if (invalidItems.length > 0) {
                console.log(`Failed to add user: Invalid items for user ${user.id}:`, invalidItems);
                results.push({ success: false, message: `Invalid items: ${invalidItems.join(', ')}` });
                continue;
            }
        }

        users.push({ ...user, items: user.items || [] });
        console.log(`Successfully added user: ${user.id}`);
        results.push({ success: true, message: `User ${user.id} added successfully` });
    }

    console.log('POST /api/users - Response:', results);
    res.status(200).json(results);
});

app.get('/api/users', (req, res) => {
    console.log('GET /api/users - Request received');
    if (users.length === 0) {
        console.log('GET /api/users - No users found');
        res.status(404).json({ message: 'No users found' });
        return;
    }

    const usersWithItems = users.map(user => ({
        ...user,
        items: user.items.map(itemId => items.find(i => i.id === itemId))
    }));

    console.log('GET /api/users - Returning users:', usersWithItems);
    res.json(usersWithItems);
});

app.get('/api/users/:id', (req, res) => {
    console.log(`GET /api/users/${req.params.id} - Request received`);
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
        console.log(`GET /api/users/${req.params.id} - User not found`);
        res.status(404).json({ message: 'User not found' });
        return;
    }

    const userWithItems = {
        ...user,
        items: user.items.map(itemId => items.find(i => i.id === itemId))
    };

    console.log(`GET /api/users/${req.params.id} - Returning user:`, userWithItems);
    res.json(userWithItems);
});

app.delete('/api/users/:id', (req, res) => {
    console.log(`DELETE /api/users/${req.params.id} - Request received`);
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) {
        console.log(`DELETE /api/users/${req.params.id} - User not found`);
        res.status(404).json({ message: 'User not found' });
        return;
    }
    users.splice(index, 1);
    console.log(`DELETE /api/users/${req.params.id} - User deleted successfully`);
    res.json({ message: 'User deleted successfully' });
});

app.put('/api/users/:id', (req, res) => {
    console.log(`PUT /api/users/${req.params.id} - Request body:`, req.body);
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) {
        console.log(`PUT /api/users/${req.params.id} - User not found`);
        res.status(404).json({ message: 'User not found' });
        return;
    }

    if (req.body.items) {
        const invalidItems = req.body.items.filter(itemId => !items.some(i => i.id === itemId));
        if (invalidItems.length > 0) {
            console.log(`PUT /api/users/${req.params.id} - Invalid items:`, invalidItems);
            res.status(400).json({ message: `Invalid items: ${invalidItems.join(', ')}` });
            return;
        }
    }

    const updatedUser = { ...users[index], ...req.body };
    users[index] = updatedUser;
    console.log(`PUT /api/users/${req.params.id} - User updated successfully:`, updatedUser);
    res.json(updatedUser);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
