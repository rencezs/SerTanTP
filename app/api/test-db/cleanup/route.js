import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/models/User";

export async function DELETE() {
    try {
        await connectDB();
        
        // Delete users that don't have the required imageUrl field
        const result = await User.deleteMany({ imageUrl: { $exists: false } });
        
        return NextResponse.json({ 
            status: "success",
            message: "Cleaned up invalid test users",
            deletedCount: result.deletedCount,
            timestamp: new Date().toISOString()
        }, { status: 200 });

    } catch (error) {
        console.error('Database cleanup error:', error);
        
        return NextResponse.json({ 
            status: "error",
            error: error.message,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
} 