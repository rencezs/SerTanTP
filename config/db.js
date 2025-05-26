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
        const mongoUri = process.env.MONGODB_URI;
        
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        
        console.log('Attempting to connect to MongoDB...');
        
        try {
            cached.promise = mongoose.connect(mongoUri, {
                bufferCommands: false,
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
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
