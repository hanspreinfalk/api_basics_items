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
    const newItems = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    for (const item of newItems) {
        if (!item.id || !item.name || !item.type || !item.effect) {
            results.push({ success: false, message: 'Missing required fields' });
            continue;
        }

        if (items.some(i => i.id === item.id)) {
            results.push({ success: false, message: `Item with ID ${item.id} already exists` });
            continue;
        }

        items.push(item);
        results.push({ success: true, message: `Item ${item.id} added successfully` });
    }

    res.status(200).json(results);
});

app.get('/api/items', (req, res) => {
    if (items.length === 0) {
        res.status(404).json({ message: 'No items found' });
        return;
    }
    res.json(items);
});

app.get('/api/items/:id', (req, res) => {
    const item = items.find(i => i.id === req.params.id);
    if (!item) {
        res.status(404).json({ message: 'Item not found' });
        return;
    }
    res.json(item);
});

app.delete('/api/items/:id', (req, res) => {
    const index = items.findIndex(i => i.id === req.params.id);
    if (index === -1) {
        res.status(404).json({ message: 'Item not found' });
        return;
    }
    items.splice(index, 1);
    res.json({ message: 'Item deleted successfully' });
});

app.put('/api/items/:id', (req, res) => {
    const index = items.findIndex(i => i.id === req.params.id);
    if (index === -1) {
        res.status(404).json({ message: 'Item not found' });
        return;
    }

    const updatedItem = { ...items[index], ...req.body };
    items[index] = updatedItem;
    res.json(updatedItem);
});

// Users endpoints
app.post('/api/users', (req, res) => {
    const newUsers = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    for (const user of newUsers) {
        if (!user.id || !user.name || !user.email) {
            results.push({ success: false, message: 'Missing required fields' });
            continue;
        }

        if (users.some(u => u.id === user.id)) {
            results.push({ success: false, message: `User with ID ${user.id} already exists` });
            continue;
        }

        // Validate items if provided
        if (user.items) {
            const invalidItems = user.items.filter(itemId => !items.some(i => i.id === itemId));
            if (invalidItems.length > 0) {
                results.push({ success: false, message: `Invalid items: ${invalidItems.join(', ')}` });
                continue;
            }
        }

        users.push({ ...user, items: user.items || [] });
        results.push({ success: true, message: `User ${user.id} added successfully` });
    }

    res.status(200).json(results);
});

app.get('/api/users', (req, res) => {
    if (users.length === 0) {
        res.status(404).json({ message: 'No users found' });
        return;
    }

    const usersWithItems = users.map(user => ({
        ...user,
        items: user.items.map(itemId => items.find(i => i.id === itemId))
    }));

    res.json(usersWithItems);
});

app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    const userWithItems = {
        ...user,
        items: user.items.map(itemId => items.find(i => i.id === itemId))
    };

    res.json(userWithItems);
});

app.delete('/api/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    users.splice(index, 1);
    res.json({ message: 'User deleted successfully' });
});

app.put('/api/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    // Validate items if provided
    if (req.body.items) {
        const invalidItems = req.body.items.filter(itemId => !items.some(i => i.id === itemId));
        if (invalidItems.length > 0) {
            res.status(400).json({ message: `Invalid items: ${invalidItems.join(', ')}` });
            return;
        }
    }

    const updatedUser = { ...users[index], ...req.body };
    users[index] = updatedUser;
    res.json(updatedUser);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
