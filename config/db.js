import mongoose from "mongoose";

let cached = global.mongoose;
 
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() { 
    if(cached.conn) {
        return cached.conn;
    }

    if(!cached.promise) {
        // Using the connection string that worked with the native driver
        const mongoUri = 'mongodb+srv://AllOff123-samePass:AllOff123@cluster0.ax0xzjc.mongodb.net/Admen?retryWrites=true&w=majority';
        
        console.log('Attempting to connect to MongoDB...');
        
        try {
            cached.promise = mongoose.connect(mongoUri, {
                bufferCommands: false,
                maxPoolSize: 10
            });
            
            const conn = await cached.promise;
            console.log('Connected to MongoDB database:', conn.connection.db.databaseName);
            
            return conn;
        } catch (error) {
            console.error('MongoDB connection error:', {
                message: error.message,
                code: error.code,
                name: error.name
            });
            cached.promise = null;
            throw error;
        }
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        throw error;
    }
}

export default connectDB;
