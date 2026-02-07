const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;
const maskedUrl = dbUrl ? dbUrl.replace(/:([^:@]+)@/, ':****@') : 'UNDEFINED';

console.log('--- DEBUGGING DATABASE CONNECTION ---');
console.log(`DATABASE_URL: ${maskedUrl}`);

if (!dbUrl) {
    console.error('ERROR: DATABASE_URL is not defined in .env');
    process.exit(1);
}

const pool = new Pool({
    connectionString: dbUrl,
});

const runDebug = async () => {
    try {
        console.log('Attempting to connect to PostgreSQL...');
        const client = await pool.connect();
        console.log('✅ Connection SUCCESSFUL!');

        const res = await client.query('SELECT NOW()');
        console.log('Database Time:', res.rows[0].now);
        client.release();

        console.log('\nChecking Schema File...');
        const schemaPath = path.join(__dirname, 'src', 'database', 'schema.sql');
        if (fs.existsSync(schemaPath)) {
            console.log(`✅ Schema file found at: ${schemaPath}`);
        } else {
            console.error(`❌ Schema file NOT found at: ${schemaPath}`);
        }

    } catch (error) {
        console.error('\n❌ Connection FAILED');
        console.error('Error Message:', error.message);
        if (error.code === '28P01') {
            console.error('--> HINT: Check your username and password in .env');
        } else if (error.code === '3D000') {
            console.error('--> HINT: The database "learnsphere" does not exist. Create it using pgAdmin or psql.');
        }
    } finally {
        await pool.end();
    }
};

runDebug();
