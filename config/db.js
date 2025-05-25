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
        const opts = { 
            bufferCommands: false,
            serverSelectionTimeoutMS: 30000, // Increase timeout
            family: 4
        }
        
        // Use a simpler connection string
        const mongoUri = 'mongodb+srv://AllOff123-samePass:AllOff123@cluster0.ax0xzjc.mongodb.net/Admen';
        
        cached.promise = mongoose.connect(mongoUri, opts)
            .then(mongoose => {
                console.log('Connected to MongoDB database:', mongoose.connection.db.databaseName);
                return mongoose;
            })
            .catch(error => {
                console.error('MongoDB connection error:', error);
                throw error;
            });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null; // Reset the promise on error
        throw error;
    }
}

export default connectDB;
