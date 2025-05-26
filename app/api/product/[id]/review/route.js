import Product from '@/models/Product';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function POST(request, { params }) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const { rating, comment } = await request.json();
    if (!rating || !comment) {
      return NextResponse.json({ success: false, message: 'Rating and comment required' }, { status: 400 });
    }
    await connectDB();
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    if (!Array.isArray(product.reviews)) {
      product.reviews = [];
    }
    product.reviews.push({ userId, rating, comment, date: Date.now() });
    await product.save();
    return NextResponse.json({ success: true, message: 'Review added' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, reviews: product.reviews });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { index } = await request.json();
    if (typeof index !== 'number') {
      return NextResponse.json({ success: false, message: 'Review index required' }, { status: 400 });
    }
    await connectDB();
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    if (!Array.isArray(product.reviews) || index < 0 || index >= product.reviews.length) {
      return NextResponse.json({ success: false, message: 'Invalid review index' }, { status: 400 });
    }
    product.reviews.splice(index, 1);
    await product.save();
    return NextResponse.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 