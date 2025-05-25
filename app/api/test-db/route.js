import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/config/db";

// Database connection test endpoint
export async function GET() {
    try {
        console.log('Testing database connection...');
        
        // Try to connect using our connectDB function
        await connectDB();
        
        // Get detailed connection information
        const dbName = mongoose.connection.db.databaseName;
        const readyState = mongoose.connection.readyState;
        const host = mongoose.connection.host;
        const port = mongoose.connection.port;
        
        // Get list of collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        return NextResponse.json({ 
            status: "healthy",
            connection: {
                state: readyState === 1 ? "connected" : "connecting",
                database: dbName,
                host: host,
                port: port
            },
            collections: collectionNames,
            timestamp: new Date().toISOString()
        }, { status: 200 });

    } catch (error) {
        console.error('Database connection test failed:', {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack
        });

        return NextResponse.json({ 
            status: "unhealthy",
            error: {
                type: error.name,
                message: error.message,
                code: error.code
            },
            details: {
                suggestions: [
                    "Check if MongoDB Atlas is accessible from your network",
                    "Verify your IP is whitelisted in MongoDB Atlas",
                    "Check if the database credentials are correct",
                    "Try connecting with MongoDB Compass to verify credentials"
                ]
            },
            timestamp: new Date().toISOString()
        }, { status: 503 });
    }
} 