const http = require('http');

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

const runVerification = async () => {
    try {
        console.log('1. Logging in...');
        const loginData = JSON.stringify({
            email: 'admin@example.com',
            password: 'admin123'
        });
        const loginRes = await postRequest('/api/admin/auth/login', loginData);
        console.log('Login Status:', loginRes.status);

        if (loginRes.status !== 200) {
            console.error('Login failed:', loginRes.data);
            return;
        }

        const token = loginRes.data.token;
        console.log('Token received.');

        console.log('2. Creating Course...');
        const courseData = JSON.stringify({
            title: "Advanced React Verification",
            short_description: "Verify nested modules",
            description: "Testing course creation via script",
            price: 0,
            course_admin_id: loginRes.data.user.id,
            visibility: "EVERYONE",
            tags: ["React", "Verification"],
            modules: [
                {
                    title: "Module 1",
                    lessons: [
                        { title: "Lesson 1", type: "VIDEO", duration_minutes: 5 }
                    ]
                }
            ]
        });

        const courseRes = await postRequest('/api/admin/courses', courseData, token);
        console.log('Create Course Status:', courseRes.status);
        console.log('Course Data:', JSON.stringify(courseRes.data, null, 2));

    } catch (err) {
        console.error('Verification failed:', err);
    }
};

runVerification();
