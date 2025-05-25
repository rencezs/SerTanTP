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
        // Connection options that we verified are working
        const opts = { 
            retryWrites: true,
            w: 'majority',
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
        }
        
        // Using the direct MongoDB URI without appending database name
        // since it's included in the connection string
        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then(mongoose => {
            return mongoose;
        })
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectDB;
