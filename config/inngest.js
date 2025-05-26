import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";
import Order from "@/models/Order";

if (!process.env.INNGEST_EVENT_KEY) {
    console.warn('INNGEST_EVENT_KEY is not defined in environment variables');
}

// Create a client to send and receive events
export const inngest = new Inngest({ 
    id: "quickcart-next",
    eventKey: process.env.INNGEST_EVENT_KEY
});

//Inngest Function to save user data to database
export const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk-creation" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        try {
            console.log('Received user creation event:', event.data);
            
            const { id, first_name, last_name, email_addresses, image_url } = event.data;
            const userData = {
                _id: id,
                email: email_addresses[0].email_address,
                name: first_name + ' ' + last_name,
                imageUrl: image_url
            }
            
            await connectDB();
            const createdUser = await User.create(userData);
            console.log('User created successfully:', createdUser);
            
            return { success: true, userId: id };
        } catch (error) {
            console.error('Error in user creation:', error);
            throw error;
        }
    }
);

// Inngest Function to update user data in database
export const syncUserUpdation = inngest.createFunction( 
    { id: "sync-user-from-clerk-updation" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        try {
            console.log('Received user update event:', event.data);
            
            const { id, first_name, last_name, email_addresses, image_url } = event.data;
            const email = Array.isArray(email_addresses) && email_addresses.length > 0
                ? email_addresses[0].email_address
                : null;
            
            const userData = {
                _id: id,
                email,
                name: first_name + ' ' + last_name,
                imageUrl: image_url
            }
            
            await connectDB();
            const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
            console.log('User updated successfully:', updatedUser);
            
            return { success: true, userId: id };
        } catch (error) {
            console.error('Error in user update:', error);
            throw error;
        }
    }
);

// Inngest Function to delete user data from database
export const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-with-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        try {
            console.log('Received user deletion event:', event.data);
            const { id } = event.data;
            
            await connectDB();
            const deletedUser = await User.findByIdAndDelete(id);
            console.log('User deleted successfully:', deletedUser);
            
            return { success: true, userId: id };
        } catch (error) {
            console.error('Error in user deletion:', error);
            throw error;
        }
    }
);

//inngest function to create user's order in database
export const createUserOrder = inngest.createFunction(
    {
        id: 'create-user-order',
        batchEvents: {
            maxSize: 5,
            timeout: '5s'
        }
    },
    { event: 'order/create' },
    async ({ events }) => { 
        try {
            const orders = events.map((event) => ({ 
                userId: event.data.userId,
                items: event.data.items,
                amount: event.data.amount,
                address: event.data.address,
                date: event.data.date
            }));

            await connectDB();
            const createdOrders = await Order.insertMany(orders);
            console.log('Orders created successfully:', createdOrders.length);

            return {
                success: true, 
                processed: orders.length
            };
        } catch (error) {
            console.error('Error creating orders:', error);
            throw error;
        }
    }
);