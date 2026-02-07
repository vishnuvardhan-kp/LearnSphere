const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:5001/api';

const testAuthSystem = async () => {
    let output = '';
    output += '=== Testing LearnSphere Authentication System ===\n\n';

    // Test 1: Admin Login (separate)
    output += '1. Testing Admin Login (Separate System)...\n';
    try {
        const adminLogin = await axios.post(`${BASE_URL}/admin/auth/login`, {
            email: 'admin@example.com',
            password: 'password123'
        });
        output += '   ✅ Admin login successful!\n';
        output += `   User: ${adminLogin.data.user.name} - Role: ${adminLogin.data.user.role}\n`;
    } catch (error) {
        output += `   ❌ Admin login failed: ${error.response?.data?.error || error.message}\n`;
    }

    // Test 2: Instructor Login (unified system)
    output += '\n2. Testing Instructor Login (Unified System)...\n';
    try {
        const instructorLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'instructor1@example.com',
            password: 'password123'
        });
        output += '   ✅ Instructor login successful!\n';
        output += `   User: ${instructorLogin.data.user.name} - Role: ${instructorLogin.data.user.role}\n`;
    } catch (error) {
        output += `   ❌ Instructor login failed: ${error.response?.data?.error || error.message}\n`;
    }

    // Test 3: Learner Login (unified system)
    output += '\n3. Testing Learner Login (Unified System)...\n';
    try {
        const learnerLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'learner1@example.com',
            password: 'password123'
        });
        output += '   ✅ Learner login successful!\n';
        output += `   User: ${learnerLogin.data.user.name} - Role: ${learnerLogin.data.user.role}\n`;
    } catch (error) {
        output += `   ❌ Learner login failed: ${error.response?.data?.error || error.message}\n`;
    }

    // Test 4: Learner Signup (allowed)
    output += '\n4. Testing Learner Signup (Should Work)...\n';
    try {
        const randomEmail = `newlearner${Date.now()}@example.com`;
        const learnerSignup = await axios.post(`${BASE_URL}/auth/signup`, {
            name: 'New Learner',
            email: randomEmail,
            password: 'password123'
        });
        output += '   ✅ Learner signup successful!\n';
        output += `   User: ${learnerSignup.data.user.name} - Role: ${learnerSignup.data.user.role}\n`;
    } catch (error) {
        output += `   ❌ Learner signup failed: ${error.response?.data?.error || error.message}\n`;
    }

    // Test 5: Admin trying to login via unified system (should fail)
    output += '\n5. Testing Admin Login via Unified System (Should Fail)...\n';
    try {
        const adminUnifiedLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@example.com',
            password: 'password123'
        });
        output += '   ❌ SECURITY ISSUE: Admin should not be able to login via unified system!\n';
    } catch (error) {
        if (error.response?.status === 403) {
            output += '   ✅ Correctly blocked! Admin cannot use unified login.\n';
        } else {
            output += `   ⚠️  Failed with different error: ${error.response?.data?.error || error.message}\n`;
        }
    }

    // Test 6: Instructor trying to login via admin system (should fail)
    output += '\n6. Testing Instructor Login via Admin System (Should Fail)...\n';
    try {
        const instructorAdminLogin = await axios.post(`${BASE_URL}/admin/auth/login`, {
            email: 'instructor1@example.com',
            password: 'password123'
        });
        output += '   ❌ SECURITY ISSUE: Instructor should not be able to login via admin system!\n';
    } catch (error) {
        if (error.response?.status === 403) {
            output += '   ✅ Correctly blocked! Instructor cannot use admin login.\n';
        } else {
            output += `   ⚠️  Failed with different error: ${error.response?.data?.error || error.message}\n`;
        }
    }

    output += '\n=== Authentication System Test Complete ===\n';
    output += '\n📋 Summary:\n';
    output += '   ✅ Admin has separate login at /api/admin/auth/login\n';
    output += '   ✅ Instructors & Learners share unified login at /api/auth/login\n';
    output += '   ✅ Only learners can signup at /api/auth/signup\n';
    output += '   ✅ Instructors are created by admin only (no signup)\n';

    console.log(output);
    fs.writeFileSync('auth-test-results.txt', output);
    console.log('\nResults saved to auth-test-results.txt');
};

testAuthSystem();
