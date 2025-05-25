import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Health check endpoint for database connectivity
export async function GET() {
    try {
        // If we're already connected, return the status
        if (mongoose.connection.readyState === 1) {
            return NextResponse.json({ 
                status: "healthy",
                connection: "connected",
                database: mongoose.connection.db.databaseName,
                timestamp: new Date().toISOString()
            }, { status: 200 });
        }

        // If not connected, try to connect
        await mongoose.connect(process.env.MONGODB_URI, {
            retryWrites: true,
            w: 'majority',
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
        });

        return NextResponse.json({ 
            status: "healthy",
            connection: "established",
            database: mongoose.connection.db.databaseName,
            timestamp: new Date().toISOString()
        }, { status: 200 });

    } catch (error) {
        console.error('Database health check failed:', {
            name: error.name,
            message: error.message,
            code: error.code
        });

        return NextResponse.json({ 
            status: "unhealthy",
            error: error.message,
            details: {
                type: error.name,
                code: error.code
            },
            timestamp: new Date().toISOString()
        }, { status: 503 }); // 503 Service Unavailable
    }
} 