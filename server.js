// 1. Import required modules
const mysql = require('mysql2');
const express = require('express');

// 2. Initialize Express app
const app = express();

// 3. Use cloud-assigned PORT (falls back to 3000 locally)
const PORT = process.env.PORT || 3000;

// 4. Middleware to parse JSON request bodies
app.use(express.json());

// 5. Create MySQL connection using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'A1b2C3d4',
    database: process.env.DB_NAME || 'my_database',
    port: process.env.DB_PORT || 3306
});

// 6. Connect to database
db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        // Don't crash the whole server if DB fails — log and continue
        return;
    }
    console.log("Connected to MySQL Database!");
});

// 7. Define Routes
app.get('/', (req, res) => {
    res.send('Welcome to My Backend Server!');
});

app.get('/api/user', (req, res) => {
    res.json({ name: "John Doe", email: "john@example.com" });
});

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

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

// 8. Start server (ONLY ONE listen call)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));