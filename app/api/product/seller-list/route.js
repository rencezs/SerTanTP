import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import authSeller from "@/lib/authSeller";

export async function GET(request) {
    try {
        console.log("Starting GET request to /api/product/seller-list");
        
        // Get user ID from Clerk
        const {userId} = getAuth(request);
        console.log("User ID from Clerk:", userId);

        if (!userId) {
            console.log("No user ID found");
            return NextResponse.json({
                success: false,
                message: "Authentication required"
            }, { status: 401 });
        }

        // Check if user is a seller
        const isSeller = await authSeller(userId);
        console.log("Is user a seller:", isSeller);

        if (!isSeller) {
            console.log("User not authorized as seller");
            return NextResponse.json({
                success: false,
                message: "Not authorized as seller"
            }, { status: 403 });
        }

        // Connect to MongoDB
        console.log("Connecting to MongoDB...");
        await connectDB();
        console.log("MongoDB connected successfully");

        // Fetch products
        console.log("Fetching products...");
        const products = await Product.find({});
        console.log(`Found ${products.length} products`);

        return NextResponse.json({
            success: true,
            products
        });

    } catch (error) {
        console.error("Error in GET /api/product/seller-list:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Internal server error",
            error: {
                name: error.name,
                message: error.message
            }
        }, { status: 500 });
    }
}