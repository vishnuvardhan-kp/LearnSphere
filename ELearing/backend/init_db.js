require('dotenv').config();
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Create connection without database selected
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true // Important for running schema.sql
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL server:', err);
        return;
    }
    console.log('Connected to MySQL server.');

    // Read schema.sql
    const schemaPath = path.join(__dirname, 'sql', 'schema.sql');
    fs.readFile(schemaPath, 'utf8', (err, sql) => {
        if (err) {
            console.error('Error reading schema.sql:', err);
            connection.end();
            return;
        }

        // Execute schema SQL
        connection.query(sql, (err, results) => {
            if (err) {
                console.error('Error executing schema.sql:', err);
            } else {
                console.log('Database initialized successfully from schema.sql');
            }
            connection.end();
        });
    });
});
