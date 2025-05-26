"use client"
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import toast from "react-hot-toast";

const Product = () => {

    const { id } = useParams();

    const { products, router, addToCart, currency, user, getToken, fetchProductData: fetchAllProducts } = useAppContext()

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedFit, setSelectedFit] = useState("");
    const sizeOptions = ["Small", "Medium", "Large", "XL", "2XL"];
    const fitOptions = ["Normal", "Oversize"];

    // Review form state
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState("");

    const fetchProductData = async () => {
        try {
            const res = await fetch(`/api/product/${id}`);
            const data = await res.json();
            if (data.success && data.product) {
                setProductData(data.product);
            }
        } catch {}
    };

    useEffect(() => {
        fetchProductData();
    }, [id]);

    // Defensive: ensure reviews is always an array
    const reviews = Array.isArray(productData?.reviews) ? productData.reviews : [];
    const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0';
    const fullStars = Math.round(avgRating);

    // Submit review handler
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewRating || !reviewComment.trim()) {
            setReviewError("Please provide a rating and comment.");
            return;
        }
        setReviewLoading(true);
        setReviewError("");
        // Debug: log product ID
        console.log('Submitting review for product ID:', id);
        // Optimistically update UI
        const optimisticReview = {
            userId: user?.id || "me",
            rating: reviewRating,
            comment: reviewComment,
            date: Date.now(),
        };
        setProductData(prev => prev ? {
            ...prev,
            reviews: [optimisticReview, ...(Array.isArray(prev.reviews) ? prev.reviews : [])],
        } : prev);
        try {
            const token = await getToken?.();
            const res = await fetch(`/api/product/${id}/review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
            });
            const data = await res.json();
            // Debug: log backend response
            console.log('Review POST response:', data);
            if (data.success) {
                toast.success("Review submitted!");
                setReviewComment("");
                setReviewRating(5);
                fetchLatestProduct();
                if (typeof fetchAllProducts === 'function') fetchAllProducts();
            } else {
                setReviewError(data.message || "Failed to submit review.");
                toast.error(data.message || "Failed to submit review.");
            }
        } catch (err) {
            setReviewError("Failed to submit review.");
            toast.error("Failed to submit review.");
        } finally {
            setReviewLoading(false);
        }
    };

    // Add a function to fetch the latest product data from the backend
    const fetchLatestProduct = async () => {
        try {
            const res = await fetch(`/api/product/${id}`);
            const data = await res.json();
            if (data.success && data.product) {
                setProductData(data.product);
            }
        } catch {}
    };

    // Add delete review handler
    const handleDeleteReview = async (index) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            const token = await getToken?.();
            const res = await fetch(`/api/product/${id}/review`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ index })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Review deleted');
                fetchLatestProduct();
            } else {
                toast.error(data.message || 'Failed to delete review');
            }
        } catch {
            toast.error('Failed to delete review');
        }
    };

    return productData ? (<>
        <Navbar />
        <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="px-5 lg:px-16 xl:px-20">
                    <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
                        <Image
                            src={mainImage || productData.image[0]}
                            alt="alt"
                            className="w-full h-auto object-cover mix-blend-multiply"
                            width={1280}
                            height={720}
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {productData.image.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setMainImage(image)}
                                className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                            >
                                <Image
                                    src={image}
                                    alt="alt"
                                    className="w-full h-auto object-cover mix-blend-multiply"
                                    width={1280}
                                    height={720}
                                />
                            </div>

                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
                        {productData.name}
                    </h1>
                    <div className="flex flex-col gap-4 mb-4">
                        <div>
                            <span className="font-medium text-gray-700 mr-2">Size:</span>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {sizeOptions.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        className={`px-4 py-1.5 rounded border text-sm transition ${selectedSize === size ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700 mr-2">Fit:</span>
                            <div className="flex gap-2 mt-2">
                                {fitOptions.map((fit) => (
                                    <button
                                        key={fit}
                                        type="button"
                                        className={`px-4 py-1.5 rounded border text-sm transition ${selectedFit === fit ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                                        onClick={() => setSelectedFit(fit)}
                                    >
                                        {fit}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Image
                                    key={index}
                                    className="h-4 w-4"
                                    src={
                                        index < fullStars
                                            ? assets.star_icon
                                            : assets.star_dull_icon
                                    }
                                    alt="star_icon"
                                />
                            ))}
                        </div>
                        <p>({avgRating})</p>
                    </div>
                    <p className="text-gray-600 mt-3">
                        {productData.description}
                    </p>
                    <p className="text-3xl font-medium mt-6">
                        {currency}{productData.offerPrice}
                        <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                            {currency}{productData.price}
                        </span>
                    </p>
                    <hr className="bg-gray-600 my-6" />
                    <div className="overflow-x-auto">
                        <table className="table-auto border-collapse w-full max-w-72">
                            <tbody>
                                <tr>
                                    <td className="text-gray-600 font-medium">Brand</td>
                                    <td className="text-gray-800/50 ">Generic</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Color</td>
                                    <td className="text-gray-800/50 ">Multi</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Category</td>
                                    <td className="text-gray-800/50">
                                        {productData.category}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center mt-10 gap-4">
                        <button
                            onClick={() => selectedSize && selectedFit && addToCart(productData._id, selectedSize, selectedFit)}
                            className={`w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition ${(!selectedSize || !selectedFit) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!selectedSize || !selectedFit}
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={() => {
                                if (selectedSize && selectedFit) {
                                    addToCart(productData._id, selectedSize, selectedFit);
                                    router.push('/cart');
                                }
                            }}
                            className={`w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition ${(!selectedSize || !selectedFit) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!selectedSize || !selectedFit}
                        >
                            Buy now
                        </button>
                    </div>

                    {/* Review Form and List */}
                    <div className="mt-10">
                        <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
                        {/* Review Form: Only show if user is logged in */}
                        {user && (
                            <form className="mb-6 flex flex-col gap-2 max-w-md" onSubmit={handleReviewSubmit}>
                                <label className="font-medium">Your Rating:</label>
                                <div className="flex gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <button
                                            type="button"
                                            key={i}
                                            className={`text-2xl ${i < reviewRating ? 'text-orange-400' : 'text-gray-300'}`}
                                            onClick={() => setReviewRating(i + 1)}
                                            aria-label={`Rate ${i + 1} star${i === 0 ? '' : 's'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    className="border rounded p-2"
                                    rows={2}
                                    placeholder="Write your review..."
                                    value={reviewComment}
                                    onChange={e => setReviewComment(e.target.value)}
                                />
                                {reviewError && <div className="text-red-500 text-xs">{reviewError}</div>}
                                <button
                                    type="submit"
                                    className="bg-orange-600 text-white px-4 py-2 rounded mt-2 disabled:opacity-60"
                                    disabled={reviewLoading}
                                >
                                    {reviewLoading ? "Submitting..." : "Submit Review"}
                                </button>
                            </form>
                        )}
                        {/* Reviews List */}
                        <div className="space-y-4">
                            {reviews.length > 0 ? reviews.map((review, idx) => (
                                <div key={idx} className="border-b pb-2 flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <span key={i} className={`text-sm ${i < review.rating ? 'text-orange-400' : 'text-gray-300'}`}>★</span>
                                            ))}
                                            <span className="text-xs text-gray-500 ml-2">{new Date(review.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-sm mt-1">{review.comment}</div>
                                    </div>
                                    {user && (user.id === review.userId || user.id === productData.userId) && (
                                        <button
                                            className="text-xs text-red-500 ml-2 hover:underline"
                                            onClick={() => handleDeleteReview(idx)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            )) : <div className="text-gray-500 text-sm">No reviews yet.</div>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 mt-16">
                    <p className="text-3xl font-medium">Featured <span className="font-medium text-orange-600">Products</span></p>
                    <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
                    {products.slice(0, 5).map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
                <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
                    See more
                </button>
            </div>
        </div>
        <Footer />
    </>
    ) : <Loading />
};

export default Product;