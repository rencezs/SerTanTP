
import { NextResponse } from 'next/server';
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";


export async function GET(request) {
    try {

        

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