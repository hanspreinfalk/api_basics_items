# Game Items API

A simple API for managing game items and users, built with Node.js and Express.

## Features

- Manage game items (create, read, update, delete)
- Manage users with their associated items
- Web interface with documentation and test tools
- Modern responsive design using CSS Grid and Flexbox

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Items

- `POST /api/items` - Create new item(s)
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get item by ID
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Users

- `POST /api/users` - Create new user(s)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Project Structure

```
.
├── app.js                 # Main server file
├── package.json           # Project configuration
├── public/                # Static files
│   ├── css/               # Stylesheets
│   │   └── styles.css     # Main styles
│   ├── html/              # HTML files
│   │   └── index.html     # Documentation page
│   └── js/                # Client-side JavaScript
│       └── script.js      # Test functions
└── README.md              # This file
```

## Testing

The web interface includes test buttons for each endpoint. Click the buttons to test the API functionality. Results will be displayed in the test output area.

## License

ISC
