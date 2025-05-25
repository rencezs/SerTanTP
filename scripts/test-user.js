import mongoose from 'mongoose';

// Define the User Schema
const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    cartItems: {
        type: Object,
        default: {}
    }
}, {
    minimize: false
});

const User = mongoose.models.user || mongoose.model('user', userSchema);

async function testUserCreation() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect('mongodb+srv://AllOff123-samePass:AllOff123@cluster0.ax0xzjc.mongodb.net/Admen?retryWrites=true&w=majority');
        console.log('Connected successfully!');

        // Create a test user
        const testUser = {
            _id: 'test_' + Date.now(),
            name: 'Test User',
            email: 'test@example.com',
            imageUrl: 'https://example.com/test.jpg',
            cartItems: {}
        };

        console.log('Creating test user:', testUser);
        const createdUser = await User.create(testUser);
        console.log('User created successfully:', createdUser);

        // Do NOT delete the user
        // await User.findByIdAndDelete(testUser._id);

    } catch (error) {
        console.error('Test failed:', {
            message: error.message,
            code: error.code,
            name: error.name
        });
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit();
    }
}

testUserCreation(); 