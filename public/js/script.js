const API_BASE_URL = 'http://localhost:3000/api';
const testOutput = document.getElementById('testOutput');

function log(message) {
    testOutput.textContent += message + '\n';
    console.log(message);
}

async function testCreateItem() {
    log('\n=== Testing Create Item ===');
    try {
        const item = {
            id: 'item1',
            name: 'Health Potion',
            type: 'Consumable',
            effect: 'Restores 50 HP'
        };

        const response = await fetch(`${API_BASE_URL}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });

        const data = await response.json();
        log(`Status: ${response.status}`);
        log(`Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
        log(`Error: ${error.message}`);
    }
}

async function testGetItems() {
    log('\n=== Testing Get Items ===');
    try {
        const response = await fetch(`${API_BASE_URL}/items`);
        const data = await response.json();
        log(`Status: ${response.status}`);
        log(`Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
        log(`Error: ${error.message}`);
    }
}

async function testCreateUser() {
    log('\n=== Testing Create User ===');
    try {
        const user = {
            id: 'user1',
            name: 'John Doe',
            email: 'john@example.com',
            items: ['item1']
        };

        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const data = await response.json();
        log(`Status: ${response.status}`);
        log(`Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
        log(`Error: ${error.message}`);
    }
}

async function testGetUsers() {
    log('\n=== Testing Get Users ===');
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const data = await response.json();
        log(`Status: ${response.status}`);
        log(`Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
        log(`Error: ${error.message}`);
    }
}

// Clear test output when page loads
testOutput.textContent = '';
