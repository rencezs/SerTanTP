'use client';
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const MyOrders = () => {
    const { currency, getToken, user, isLoading: isContextLoading } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        try {
            const token = await getToken();
            if (!token) {
                setError('Please login to view orders');
                toast.error('Please login to view orders');
                return;
            }

            const {data} = await axios.get('/api/order/list', {headers: {Authorization: `Bearer ${token}`}})

            if (data.success) { 
                // Ensure orders is always an array
                setOrders(Array.isArray(data.orders) ? data.orders.reverse() : []);
            } else { 
                setError(data.message);
                toast.error(data.message);
            }
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isContextLoading && user) {
            fetchOrders();
        } else if (!isContextLoading && !user) {
            setLoading(false);
        }
    }, [user, isContextLoading]);

    if (isContextLoading || loading) {
        return (
            <>
                <Navbar />
                <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
                    <Loading />
                </div>
                <Footer />
            </>
        );
    }

    if (!user) {
        return (
            <>
                <Navbar />
                <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
                    <div className="text-center py-10">
                        Please login to view your orders
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
                    <div className="text-center py-10 text-red-500">
                        {error}
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
                <div className="space-y-5">
                    <h2 className="text-lg font-medium mt-6">My Orders</h2>
                    <div className="max-w-5xl border-t border-gray-300 text-sm">
                        {Array.isArray(orders) && orders.map((order, index) => {
                            if (!order?.items || !Array.isArray(order.items)) return null;
                            
                            return (
                                <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300">
                                    <div className="flex-1 flex gap-5 max-w-80">
                                        <Image
                                            className="max-w-16 max-h-16 object-cover"
                                            src={assets.box_icon}
                                            alt="box_icon"
                                        />
                                        <p className="flex flex-col gap-3">
                                            <span className="font-medium text-base">
                                                {order.items.map((item) => {
                                                    if (!item?.product?.name || !item?.quantity) return '';
                                                    return `${item.product.name} x ${item.quantity}`;
                                                }).filter(Boolean).join(", ")}
                                            </span>
                                            <span>Items: {order.items.length}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p>
                                            <span className="font-medium">{order.address?.fullName || 'N/A'}</span>
                                            <br />
                                            <span>{order.address?.area || 'N/A'}</span>
                                            <br />
                                            <span>{`${order.address?.city || 'N/A'}, ${order.address?.state || 'N/A'}`}</span>
                                            <br />
                                            <span>{order.address?.phoneNumber || 'N/A'}</span>
                                        </p>
                                    </div>
                                    <p className="font-medium my-auto">{currency}{order.amount || 0}</p>
                                    <div>
                                        <p className="flex flex-col">
                                            <span>Method: COD</span>
                                            <span>Date: {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</span>
                                            <span>Payment: Pending</span>
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        {(!Array.isArray(orders) || orders.length === 0) && (
                            <div className="text-center py-10">
                                No orders found
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyOrders;