import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import User from "@/models/User";
import { inngest } from "@/config/inngest";
import connectDB from "@/lib/mongodb";

export async function POST(request) {
    try {
        const {userId} = getAuth(request);
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const {address, items} = await request.json();
        
        if (!address || !items || items.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Invalid data: Address and items are required' },
                { status: 400 }
            );
        }

        // Connect to database first
        await connectDB();

        // Calculate amount using items
        let totalAmount = 0;
        for (const item of items) {
            // Extract productId, size, fit from item.product
            const [productId, size, fit] = item.product.split('_');
            const product = await Product.findById(productId);
            if (!product) {
                return NextResponse.json(
                    { success: false, message: `Product not found: ${item.product}` },
                    { status: 404 }
                );
            }
            totalAmount += product.offerPrice * item.quantity;
            // Optionally, update item to include size/fit for order record
            item.product = productId;
            if (size) item.size = size;
            if (fit) item.fit = fit;
        }

        // Add 20% for taxes and fees
        const finalAmount = totalAmount + Math.floor(totalAmount * 0.2);

        // Prepare order data
        const orderData = {
            userId,
            address,
            items,
            amount: finalAmount,
            date: Date.now()
        };

        // Send order creation event to Inngest
        try {
            await inngest.send({
                name: 'order/create',
                data: orderData
            });

            // Clear user cart
            const user = await User.findById(userId);
            if (user) {
                user.cartItems = [];
                await user.save();
            }

            return NextResponse.json(
                { 
                    success: true, 
                    message: 'Order Placed Successfully', 
                    amount: finalAmount,
                    orderId: orderData.date // Using timestamp as temporary order ID
                },
                { status: 201 }
            );
        } catch (inngestError) {
            console.error('Failed to send event to Inngest:', inngestError);
            // If Inngest fails, we should still create the order directly
            const Order = (await import('@/models/Order')).default;
            const order = await Order.create(orderData);
            
            return NextResponse.json(
                { 
                    success: true, 
                    message: 'Order Placed Successfully (Fallback Mode)', 
                    amount: finalAmount,
                    orderId: order._id
                },
                { status: 201 }
            );
        }

    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to create order' },
            { status: 500 }
        );
    }
}