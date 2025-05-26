import { clerkClient } from '@clerk/nextjs/server';

const authSeller = async (userId) => {
    try {
        console.log('Checking seller authorization for:', userId);
        
        if (!userId) {
            console.log('No userId provided to authSeller');
            return false;
        }

        // Get Clerk client and user
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        
        console.log('Clerk user found:', user ? 'yes' : 'no');
        
        if (!user) {
            console.log('User not found in Clerk');
            return false;
        }

        // Check metadata
        const metadata = user.publicMetadata || {};
        console.log('User metadata:', JSON.stringify(metadata));
        
        // Check role in multiple ways to be thorough
        const hasSellerRole = 
            metadata.role === 'seller' || 
            metadata.roles?.includes('seller') ||
            metadata.userRole === 'seller';
            
        if (hasSellerRole) {
            console.log('User is authorized as seller');
            return true;
        }

        // If no seller role found, log the reason
        console.log('Not a seller:', {
            hasMetadata: !!user.publicMetadata,
            role: metadata.role,
            roles: metadata.roles,
            userRole: metadata.userRole
        });
        
        return false;
    } catch (error) {
        console.error('Error in authSeller:', error);
        // If user is not found or any error, treat as not authorized
        return false;
    }
}

export default authSeller;