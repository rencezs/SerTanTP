import mongoose from 'mongoose';

const testConnection = async () => {
    try {
        console.log('Starting connection test...');
        
        const mongoUri = 'mongodb+srv://AllOff123-samePass:AllOff123@cluster0.ax0xzjc.mongodb.net/Admen?directConnection=true&ssl=true';
        
        const connection = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 10000,
            family: 0,
            maxIdleTimeMS: 10000,
            autoCreate: true
        });
        
        console.log('Connection successful!');
        console.log('Connected to database:', connection.connection.db.databaseName);
        
        // Test database operations
        const collections = await connection.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        
        // Close connection
        await mongoose.disconnect();
        console.log('Connection closed successfully');
        
    } catch (error) {
        console.error('Connection test failed:', {
            message: error.message,
            code: error.code,
            name: error.name
        });
    } finally {
        process.exit();
    }
};

testConnection(); 