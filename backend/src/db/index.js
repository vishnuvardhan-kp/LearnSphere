const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

const executeSchema = async () => {
    try {
        const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        console.log('Reading and executing schema...');
        await pool.query(schemaSql);
        console.log('Schema execution successful (Safe & Idempotent).');
    } catch (error) {
        console.error('Error executing schema:', error);
        throw error;
    }
};

const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to PostgreSQL database.');
        client.release();
        await executeSchema();
    } catch (error) {
        console.error('Database connection failure:', error.message);
        throw error;
    }
};

module.exports = {
    pool,
    connectDB
};
