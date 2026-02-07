const { pool } = require('./src/db');

async function seedInstructors() {
    try {
        console.log("--- Seeding Instructors ---");

        const instructors = [
            { name: "Sarah Wilson", email: "sarah@example.com" },
            { name: "James Bond", email: "james@example.com" },
            { name: "Emily Clark", email: "emily@example.com" }
        ];

        for (const inst of instructors) {
            const check = await pool.query("SELECT id FROM users WHERE email = $1", [inst.email]);
            if (check.rowCount === 0) {
                await pool.query(`
                    INSERT INTO users (name, email, password, role)
                    VALUES ($1, $2, $3, 'INSTRUCTOR')`,
                    [inst.name, inst.email, 'hashedpassword']
                );
                console.log(`Created instructor: ${inst.name}`);
            } else {
                console.log(`Instructor exists: ${inst.name}`);
            }
        }
        console.log("Seeding complete!");

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}
seedInstructors();
