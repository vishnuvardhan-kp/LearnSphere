require('dotenv').config();
const { sendInstructorCredentials } = require('./src/services/email.service');

async function testEmail() {
    console.log('Testing email service...');
    console.log(`User: ${process.env.EMAIL_USER}`);

    // Send to the sender's email for testing
    const success = await sendInstructorCredentials(
        process.env.EMAIL_USER,
        'Test Instructor',
        'test-password-123'
    );

    if (success) {
        console.log('✅ Email sent successfully!');
    } else {
        console.error('❌ Failed to send email.');
    }
}

testEmail();
