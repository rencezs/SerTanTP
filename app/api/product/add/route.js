import { NextResponse } from 'next/server';
import {v2 as cloudinary} from 'cloudinary'
import { getAuth } from '@clerk/nextjs/server'
import authSeller from '@/lib/authSeller';
import connectDB from '@/config/db';
import Product from '@/models/Product';

//Configure Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(request) {
    try {
        // 1. Authentication check
        const {userId} = getAuth(request)
        console.log('Adding product for user:', userId);

        if (!userId) {
            console.log('No userId provided in request');
            return NextResponse.json({
                success: false,
                message: "Authentication required"
            })
        }

        // 2. Seller authorization check
        const isSeller = await authSeller(userId)
        console.log('Is seller check result:', isSeller);

        if (!isSeller) {
            return NextResponse.json({
                success: false, 
                message: "Not authorized - user must be a seller. Please check your account settings."
            })
        }

        // 3. Form data validation
        const formData = await request.formData() 
        const name = formData.get('name')?.trim();
        const description = formData.get('description')?.trim();
        const category = formData.get('category')?.trim();
        const price = parseFloat(formData.get('price'));
        const offerPrice = parseFloat(formData.get('offerPrice'));

        // Validate required fields
        const validationErrors = [];
        if (!name) validationErrors.push('Name is required');
        if (!description) validationErrors.push('Description is required');
        if (!category) validationErrors.push('Category is required');
        if (isNaN(price) || price <= 0) validationErrors.push('Valid price is required');
        if (isNaN(offerPrice) || offerPrice <= 0) validationErrors.push('Valid offer price is required');
        if (offerPrice > price) validationErrors.push('Offer price cannot be greater than regular price');

        if (validationErrors.length > 0) {
            return NextResponse.json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            })
        }

        // 4. Image upload validation
        const files = formData.getAll('images')
        console.log('Number of images received:', files.length);

        if (!files || files.length === 0) {
            return NextResponse.json({ 
                success: false, 
                message: "At least one product image is required"
            })
        }

        if (files.length > 5) {
            return NextResponse.json({ 
                success: false, 
                message: "Maximum 5 images allowed per product"
            })
        }

        // 5. Upload images to Cloudinary
        console.log('Uploading images to Cloudinary...');
        const uploadPromises = files.map(async (file) => { 
            try {
                const arrayBuffer = await file.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)

                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            resource_type: 'auto',
                            folder: 'quickcart/products'
                        },
                        (error, result) => { 
                            if (error) {
                                console.error('Cloudinary upload error:', error);
                                reject(error)
                            } else {
                                resolve(result)
                            }
                        }      
                    )
                    stream.end(buffer)
                }) 
            } catch (error) {
                console.error('Error processing image:', error);
                throw error;
            }
        });

        const results = await Promise.all(uploadPromises);
        const images = results.map(result => result.secure_url);
        console.log('Images uploaded successfully:', images.length);

        // 6. Save to database
        console.log('Connecting to database...');
        await connectDB()
        
        console.log('Creating product...');
        const newProduct = await Product.create({
            userId,
            name,
            description,
            category,
            price,
            offerPrice,
            image: images,
            date: Date.now()
        })
        console.log('Product created successfully:', newProduct._id);

        return NextResponse.json({ 
            success: true, 
            message: "Product uploaded successfully", 
            product: newProduct 
        })

    } catch (error) {
        console.error('Error in product add route:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || "Internal Server Error",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        })
    }
}
