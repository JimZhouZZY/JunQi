const bcrypt = require('bcryptjs');
const db = require('./db');
const { SECRET_KEY } = require('./constants.js')
const { authenticateToken } = require('./func');
const jwt = require('jsonwebtoken');
const express = require('express');

var app = express();
app.use(express.static('public'));
app.use(express.json());

var http = require('http').Server(app);
var port = process.env.PORT || 3000;

http.listen(port, function () {
    console.log('listening on port: ' + port);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/login-register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    // If the username is taken, try to login
    user = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (user[0].length > 0) {
        userData = user[0][0]
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, userData.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: userData.id }, SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login successful!', token });
    }

    // If the username is not taken, create a new user with that password
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Save to the database
    await db.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully!' });
});

app.get('/protected-route', authenticateToken, (req, res) => {
    res.status(200).json({
        message: 'Valid token',
        user: req.user, // Return user info from the token
    });
});

app.post('/get-username', async (req, res) => {
    const { userid } = req.body;
    user = await db.query('SELECT * FROM users WHERE id = ?', [userid]);
    if (user[0].length > 0) {
        res.json({ username: user[0][0].username });
    } else {
        return res.status(404).json({ error: 'User not found' });
    }
});

app.post('/get-userid', async (req, res) => {
    const { username } = req.body;
    user = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (user[0].length > 0) {
        res.json({ userid: user[0][0].id });
    } else {
        return res.status(404).json({ error: 'User not found' });
    }
});

var io = require('socket.io')(http);

io.on('connection', function (socket) {
    console.log('new connection');

    // Handle the move event
    socket.on('move', function (msg) {
        socket.broadcast.emit('move', msg);
    });
});
