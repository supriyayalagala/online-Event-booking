const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function testAuth() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event-booking');
    
    // Clear and create test user
    await User.deleteMany({ email: 'test@example.com' });
    
    const user = await User.create({
        name: 'Test',
        email: 'test@example.com',
        password: 'password123'
    });
    
    console.log('Saved password hash:', user.password);
    
    const isMatch = await user.matchPassword('password123');
    console.log('Password match?', isMatch);
    
    // Check seed user
    const admin = await User.findOne({ email: 'admin@example.com' });
    if (admin) {
        console.log('Admin saved password:', admin.password);
        const adminMatch = await admin.matchPassword('password123');
        console.log('Admin password match?', adminMatch);
    }
    
    process.exit();
}

testAuth();
