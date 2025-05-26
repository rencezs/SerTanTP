import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

//Inngest Function to save user data to database
export const syncUserCreation = inngest.createFunction(
    {
        id: "sync-user-from-clerk-creation",
    },
    {
        event: "clerk/user.created",
    },

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
            
            console.log('Attempting database connection for user creation');
            await connectDB();
            console.log('Database connected successfully');
            
            const createdUser = await User.create(userData);
            console.log('User created successfully:', createdUser);
            
            return { success: true, userId: id };
        } catch (error) {
            console.error('Error in user creation:', error);
            throw error;
        }
    }
)

// Inngest Function to update user data in database
export const syncUserUpdation = inngest.createFunction( 
    {
        id: "sync-user-from-clerk-updation"
    },
    {
        event: "clerk/user.updated",
    },

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
            
            console.log('Attempting database connection for user update');
            await connectDB();
            console.log('Database connected successfully');
            
            const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
            console.log('User updated successfully:', updatedUser);
            
            return { success: true, userId: id };
        } catch (error) {
            console.error('Error in user update:', error);
            throw error;
        }
    }
)

// Inngest Function to delete user data from database
export const syncUserDeletion = inngest.createFunction(
    {
        id: "delete-user-with-clerk"
    },
    {
        event: "clerk/user.deleted"
    },
    async ({ event }) => {
        try {
            console.log('Received user deletion event:', event.data);
            
            const { id } = event.data;
            
            console.log('Attempting database connection for user deletion');
            await connectDB();
            console.log('Database connected successfully');
            
            const deletedUser = await User.findByIdAndDelete(id);
            console.log('User deleted successfully:', deletedUser);
            
            return { success: true, userId: id };
        } catch (error) {
            console.error('Error in user deletion:', error);
            throw error;
        }
    }
)


//inngest function to create user's order in database
export const createUserOrder = inngest.createFunction(
    {
        id:'create-user-order',
        batchEvents: {
            maxSize: 5,
            timeout: '5s'
        }
    },
    {
        event: 'order/create'
    },
    async ({ events }) => { 
        const orders  = events.map((event) => { 
            return {
                userId: event.data.userId,
                items: event.data.items,
                amount: event.data.amount,
                address: event.data.address,
                date: event.data.date
            }
        })

        await connectDB();
        await Order.insertMany(orders);

        return {
            success: true, 
            processed: orders.length
        };

        
        
    }
)