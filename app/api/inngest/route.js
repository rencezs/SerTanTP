import { serve } from "inngest/next";
import { inngest, syncUserCreation, syncUserUpdation, syncUserDeletion, createUserOrder } from "@/config/inngest";

// Serve your Inngest functions
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        syncUserCreation,
        syncUserUpdation,
        syncUserDeletion,
        createUserOrder
    ],
    // Add basic auth for security in development
    baseAuth: process.env.NODE_ENV === 'development' ? {
        username: 'quickcart',
        password: process.env.INNGEST_DEV_PASSWORD || 'development'
    } : undefined
});
