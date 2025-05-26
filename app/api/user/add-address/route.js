import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Address from "@/models/Address";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        // Get user ID and validate authentication
        const {userId} = getAuth(request);
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Parse and validate request body
        const {address} = await request.json();
        if (!address) {
            return NextResponse.json(
                { success: false, message: "Address data is required" },
                { status: 400 }
            );
        }

        // Validate required fields
        const requiredFields = ['fullName', 'phoneNumber', 'pincode', 'area', 'city', 'state'];
        const missingFields = requiredFields.filter(field => !address[field]);
        if (missingFields.length > 0) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: `Missing required fields: ${missingFields.join(', ')}` 
                },
                { status: 400 }
            );
        }

        // Connect to database
        console.log('Connecting to database...');
        await connectDB();

        // Create new address
        console.log('Creating new address for user:', userId);
        const newAddress = await Address.create({
            ...address,
            userId,
            pincode: parseInt(address.pincode) // Ensure pincode is a number
        });

        console.log('Address created successfully:', newAddress._id);
        return NextResponse.json(
            {
                success: true, 
                message: 'Address added successfully', 
                address: newAddress
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error adding address:', error);
        return NextResponse.json(
            {
                success: false, 
                message: error.message || 'Failed to add address'
            },
            { status: 500 }
        );
    }
}