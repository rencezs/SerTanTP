import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/config/db";

// Database connection test endpoint
export async function GET() {
    try {
        // Try to connect using our connectDB function
        await connectDB();
        
        // Get database name and connection status
        const dbName = mongoose.connection.db.databaseName;
        const readyState = mongoose.connection.readyState;
        const host = mongoose.connection.host;

        return NextResponse.json({ 
            status: "healthy",
            connection: readyState === 1 ? "connected" : "connecting",
            database: dbName,
            host: host,
            timestamp: new Date().toISOString()
        }, { status: 200 });

    } catch (error) {
        console.error('Database connection error:', {
            name: error.name,
            message: error.message,
            code: error.code
        });

        return NextResponse.json({ 
            status: "unhealthy",
            error: error.message,
            details: {
                type: error.name,
                code: error.code,
                suggestions: [
                    "Check your internet connection",
                    "Verify MongoDB Atlas is accessible",
                    "Check if the database credentials are correct"
                ]
            },
            timestamp: new Date().toISOString()
        }, { status: 503 });
    }
} 