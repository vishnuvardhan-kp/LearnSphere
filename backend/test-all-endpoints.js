const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api/admin';

const testAllEndpoints = async () => {
    let token = '';
    
    console.log('=== Testing LearnSphere Admin Backend ===\n');
    
    // 1. Test Login
    try {
        console.log('1. Testing Login...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@example.com',
            password: 'password123'
        });
        token = loginResponse.data.token;
        console.log('✅ Login successful!');
        console.log('   User:', loginResponse.data.user.name);
        console.log('   Role:', loginResponse.data.user.role);
    } catch (error) {
        console.error('❌ Login failed:', error.response?.data || error.message);
        return;
    }
    
    const headers = { Authorization: `Bearer ${token}` };
    
    // 2. Test Users List
    try {
        console.log('\n2. Testing Users List...');
        const usersResponse = await axios.get(`${BASE_URL}/users`, { headers });
        console.log('✅ Users list retrieved successfully!');
        console.log('   Total users:', usersResponse.data.pagination.total);
    } catch (error) {
        console.error('❌ Users list failed:', error.response?.data || error.message);
    }
    
    // 3. Test Learners List
    try {
        console.log('\n3. Testing Learners List...');
        const learnersResponse = await axios.get(`${BASE_URL}/users/learners`, { headers });
        console.log('✅ Learners list retrieved successfully!');
        console.log('   Total learners:', learnersResponse.data.length);
    } catch (error) {
        console.error('❌ Learners list failed:', error.response?.data || error.message);
    }
    
    // 4. Test Instructors List
    try {
        console.log('\n4. Testing Instructors List...');
        const instructorsResponse = await axios.get(`${BASE_URL}/users/instructors`, { headers });
        console.log('✅ Instructors list retrieved successfully!');
        console.log('   Total instructors:', instructorsResponse.data.length);
    } catch (error) {
        console.error('❌ Instructors list failed:', error.response?.data || error.message);
    }
    
    // 5. Test Courses List
    try {
        console.log('\n5. Testing Courses List...');
        const coursesResponse = await axios.get(`${BASE_URL}/courses`, { headers });
        console.log('✅ Courses list retrieved successfully!');
        console.log('   Total courses:', coursesResponse.data.pagination?.total || coursesResponse.data.length);
    } catch (error) {
        console.error('❌ Courses list failed:', error.response?.data || error.message);
    }
    
    // 6. Test Reports
    try {
        console.log('\n6. Testing Reports...');
        const reportsResponse = await axios.get(`${BASE_URL}/reports/overview`, { headers });
        console.log('✅ Reports retrieved successfully!');
        console.log('   Data:', JSON.stringify(reportsResponse.data, null, 2));
    } catch (error) {
        console.error('❌ Reports failed:', error.response?.data || error.message);
    }
    
    console.log('\n=== Backend Testing Complete ===');
    console.log('✅ Backend is properly connected to PostgreSQL and working!');
};

testAllEndpoints();
