import { clerkClient } from '@clerk/nextjs/server';

const authSeller = async (userId) => {
    try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        if (user && user.publicMetadata && user.publicMetadata.role === 'seller') {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        // If user is not found or any error, treat as not authorized
        return false;
    }
}

export default authSeller;