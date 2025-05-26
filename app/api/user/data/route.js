import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from '@clerk/nextjs/server';
import connectDB from "@/config/db";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        // 1. Get userId and verify authentication
        const {userId} = getAuth(request)
        console.log('Fetching user data for:', userId);

        if (!userId) {
            console.log('No userId provided in request');
            return NextResponse.json({
                success: false, 
                message: "Authentication required"
            })
        }

        // 2. First, get the Clerk user to ensure they exist
        let clerkUser;
        try {
            const clerk = await clerkClient();
            clerkUser = await clerk.users.getUser(userId);
            console.log('Clerk user found:', clerkUser ? 'yes' : 'no');
        } catch (clerkError) {
            console.error('Error fetching Clerk user:', clerkError);
            return NextResponse.json({
                success: false,
                message: "Error verifying user authentication"
            });
        }

        if (!clerkUser) {
            console.log('User not found in Clerk');
            return NextResponse.json({
                success: false,
                message: "User not found in authentication system"
            });
        }

        // 3. Connect to MongoDB and look for user
        await connectDB()
        let user = await User.findById(userId)
        console.log('MongoDB user found:', user ? 'yes' : 'no');

        // 4. If no MongoDB user but we have Clerk user, create them
        if (!user && clerkUser) {
            console.log('Creating new user in MongoDB from Clerk data');
            try {
                // Get the first verified email
                const verifiedEmail = clerkUser.emailAddresses.find(email => email.verification?.status === 'verified')
                    || clerkUser.emailAddresses[0];
                
                const userData = {
                    _id: userId,
                    email: verifiedEmail.emailAddress,
                    name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'New User',
                    imageUrl: clerkUser.imageUrl || '',
                    cartItems: {}
                };

                user = await User.create(userData);
                console.log('Created new user in MongoDB:', user._id);
            } catch (createError) {
                console.error('Error creating user in MongoDB:', createError);
                return NextResponse.json({
                    success: false,
                    message: "Failed to create user profile"
                });
            }
        }

        // 5. Final check and response
        if (!user) {
            return NextResponse.json({
                success: false, 
                message: "Could not find or create user profile"
            });
        }

        // 6. Update user data if needed
        if (user.name === 'New User' && clerkUser.firstName) {
            user = await User.findByIdAndUpdate(
                userId,
                { 
                    name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
                    imageUrl: clerkUser.imageUrl || user.imageUrl
                },
                { new: true }
            );
        }

        return NextResponse.json({success: true, user})

    } catch (error) {   
        console.error('Error in user data route:', error);
        return NextResponse.json({
            success: false, 
            message: error.message || "Internal Server Error"
        })         
    }
}