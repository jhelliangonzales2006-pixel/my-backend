// 1. Import required modules
const mysql = require('mysql2');
const express = require('express');

// 2. Initialize Express app (THIS WAS MISSING)
const app = express();
const PORT = 3000;

// 3. Middleware to parse JSON request bodies
app.use(express.json());

// 4. Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'A1b2C3d4', // ⚠️ Make sure your MySQL password is here if you have one
    database: 'my_database'
});

// 5. Connect to database
db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL Database!");
});

// 6. Define Routes
// Route: Home
app.get('/', (req, res) => {
    res.send('Welcome to My Backend Server!');
});

// Route: API Example
app.get('/api/user', (req, res) => {
    res.json({ name: "John Doe", email: "john@example.com" });
});

// Route: Submit Contact Form (Step 4 - Saves to Database)
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body; 

    // Validation
    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: "Invalid email address" });
    }

    const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
    
    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error("Database insert error:", err);
            return res.status(500).json({ error: "Failed to save message to database." });
        }
        
        res.json({
            message: `Thank you ${name}, your message has been saved!`,
            data: { id: result.insertId, name, email, message }
        });
    });
});

// 7. Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});