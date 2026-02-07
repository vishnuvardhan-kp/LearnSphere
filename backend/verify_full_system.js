const http = require('http');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const postRequest = (path, data, token) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 5001,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
};

const getRequest = (path, token) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 5001,
            path: path,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.end();
    });
};

const verifyBackend = async () => {
    console.log('--- STARTING BACKEND VERIFICATION (Native HTTP) ---');

    try {
        // 1. Check Database Connection & Data
        console.log('\n1. Checking Database...');

        try {
            const userCount = await pool.query('SELECT COUNT(*) FROM users');
            console.log(`   Users Count: ${userCount.rows[0].count}`);

            const courseCount = await pool.query('SELECT COUNT(*) FROM courses');
            console.log(`   Courses Count: ${courseCount.rows[0].count}`);

            const lessonsCount = await pool.query('SELECT COUNT(*) FROM lessons');
            console.log(`   Lessons Count: ${lessonsCount.rows[0].count}`);
        } catch (dbErr) {
            console.error('   DATABASE ERROR:', dbErr.message);
        }

        // 2. Check API Endpoints (Admin Login)
        console.log('\n2. Checking API (Login)...');
        let token = '';
        try {
            const loginData = JSON.stringify({
                email: 'admin@example.com',
                password: 'password123'
            });
            const loginRes = await postRequest('/api/admin/auth/login', loginData);

            if (loginRes.status === 200) {
                console.log('   Login: SUCCESS');
                token = loginRes.data.token;
            } else {
                console.error('   Login: FAILED', loginRes.status);
                console.error('   Data:', JSON.stringify(loginRes.data));
                return;
            }
        } catch (e) {
            console.error('   Login Request: FAILED', e.message);
            return;
        }

        // 3. Check Courses Endpoint
        console.log('\n3. Checking API (Courses)...');
        try {
            const coursesRes = await getRequest('/api/admin/courses', token);
            console.log(`   Courses API Status: ${coursesRes.status}`);
            if (coursesRes.status === 200) {
                const courses = coursesRes.data.data || coursesRes.data;
                console.log(`   Courses Found: ${courses.length}`);
            } else {
                console.error('   Courses API Error:', JSON.stringify(coursesRes.data));
            }
        } catch (e) {
            console.error('   Courses API Request: FAILED', e.message);
        }

        // 4. Check Learners Endpoint
        console.log('\n4. Checking API (Learners)...');
        try {
            const learnersRes = await getRequest('/api/admin/users/learners', token);
            console.log(`   Learners API Status: ${learnersRes.status}`);
            if (learnersRes.status === 200) {
                console.log(`   Learners Found: ${learnersRes.data.length}`);
            } else {
                console.error('   Learners API Error:', JSON.stringify(learnersRes.data));
            }
        } catch (e) {
            console.error('   Learners API Request: FAILED', e.message);
        }

    } catch (error) {
        console.error('\nCRITICAL ERROR:', error.message);
    } finally {
        await pool.end();
        console.log('\n--- VERIFICATION FINISHED ---');
    }
};

verifyBackend();
