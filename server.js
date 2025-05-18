const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // ✅ This serves all static files

// MySQL config
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'starlight_events1'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL (XAMPP)');
});

// ✅ Save data from contact form
app.post('/register', (req, res) => {
  const { name, phone, email, message } = req.body;
  const query = 'INSERT INTO register (name, phone, email, message) VALUES (?, ?, ?, ?)';
  db.query(query, [name, phone, email, message], (err, result) => {
    if (err) {
      console.error('Insert Error:', err);
      return res.status(500).send('Database insert error');
    }
    res.send('Submitted successfully!');
  });
});

// ✅ Endpoint for admin panel to fetch messages
app.get('/get-messages', (req, res) => {
  db.query('SELECT * FROM register ORDER BY id DESC', (err, results) => {
    if (err) {
      console.error('Select Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server running: http://localhost:3000');
});
