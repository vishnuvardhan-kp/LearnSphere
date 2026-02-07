const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const testConnection = async () => {
    let output = '';
    try {
        output += '=== Testing PostgreSQL Connection ===\n\n';
        output += 'Database URL: ' + process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@') + '\n';
        
        const client = await pool.connect();
        output += '✅ Successfully connected to PostgreSQL!\n\n';
        
        // Test query
        const result = await client.query('SELECT NOW(), version()');
        output += 'Database Time: ' + result.rows[0].now + '\n';
        output += 'PostgreSQL Version: ' + result.rows[0].version.split(',')[0] + '\n';
        
        // Check if database exists and has tables
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        
        output += '\n=== Database Tables ===\n';
        if (tablesResult.rows.length === 0) {
            output += '⚠️  No tables found! Schema needs to be initialized.\n';
        } else {
            output += `Found ${tablesResult.rows.length} tables:\n`;
            tablesResult.rows.forEach(row => {
                output += `  - ${row.table_name}\n`;
            });
        }
        
        // Check users table specifically
        const usersCheck = await client.query(`
            SELECT COUNT(*) as count FROM users;
        `);
        output += `\n✅ Users table has ${usersCheck.rows[0].count} records\n`;
        
        // Check admin user
        const adminCheck = await client.query(`
            SELECT id, name, email, role FROM users WHERE role = 'admin';
        `);
        output += `\n=== Admin Users ===\n`;
        if (adminCheck.rows.length === 0) {
            output += '⚠️  No admin users found!\n';
        } else {
            adminCheck.rows.forEach(user => {
                output += `  - ${user.name} (${user.email}) - Role: ${user.role}\n`;
            });
        }
        
        client.release();
        output += '\n=== Connection Test Complete ===\n';
        output += '✅ Backend is properly connected to PostgreSQL!\n';
        
    } catch (error) {
        output += '\n❌ Database Connection Failed!\n';
        output += 'Error: ' + error.message + '\n';
        
        if (error.code === '28P01') {
            output += '\n💡 Hint: Authentication failed. Check your username and password in .env\n';
        } else if (error.code === '3D000') {
            output += '\n💡 Hint: Database "learnsphere" does not exist.\n';
            output += '   Create it in pgAdmin:\n';
            output += '   1. Open pgAdmin\n';
            output += '   2. Right-click on "Databases" → Create → Database\n';
            output += '   3. Name it "learnsphere"\n';
        } else if (error.code === 'ECONNREFUSED') {
            output += '\n💡 Hint: PostgreSQL server is not running or not accessible.\n';
            output += '   Make sure PostgreSQL is running on localhost:5432\n';
        }
    } finally {
        await pool.end();
    }
    
    console.log(output);
    fs.writeFileSync('db-connection-test.txt', output);
    console.log('\nOutput saved to db-connection-test.txt');
};

testConnection();
