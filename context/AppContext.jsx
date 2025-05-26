'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import axios from "axios";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY || '$'
    const router = useRouter()

    const { user, isLoaded: isUserLoaded } = useUser();
    const {getToken} = useAuth()

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchProductData = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const {data} = await axios.get('/api/product/list')

            if (data.success) {
                setProducts(data.products)
            } else {
                setError(data.message)
                toast.error(data.message)
            }

        } catch (error) {
            setError(error.message)
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchUserData = async () => {
       try {
        setError(null)
        if (user?.publicMetadata?.role === 'seller') {
            setIsSeller(true)
        }

        const token = await getToken()
        if (!token) {
            setError('Authentication token not available')
            return
        }

        const {data} = await axios.get('/api/user/data', { headers: {Authorization: `Bearer ${token}`}})

        if (data.success) {
            setUserData(data.user)
            setCartItems(data.user.cartItems || {})
        } else {
            setError(data.message)
            toast.error(data.message)
        }
        
       } catch (error) {
        setError(error?.message || 'Error fetching user data')
        toast.error(error?.message || 'Error fetching user data')
       }
    }

    const addToCart = async (itemId) => {

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        

        if (user) {
            try {
                const token = await getToken()

                await axios.post('/api/cart/update', {cartData}, {headers: {Authorization: `Bearer ${token}`}})

                toast.success('Item added to cart')

            } catch (error) {
                toast.error(error.message)
            }
        }

    }

    const updateCartQuantity = async (itemId, quantity) => {

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)

        if (user) {
            try {
                const token = await getToken()

                await axios.post('/api/cart/update', {cartData}, {headers: {Authorization: `Bearer ${token}`}})

                toast.success('Cart updated')

            } catch (error) {
                toast.error(error.message)
            }
        }

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
        if (isUserLoaded) {
            if (user) {
                fetchUserData()
            } else {
                setIsLoading(false)
            }
        }
    }, [user, isUserLoaded])

    const value = {
        user,
        getToken,
        currency,
        router,
        isSeller,
        setIsSeller,
        userData,
        fetchUserData,
        products,
        fetchProductData,
        cartItems,
        setCartItems,
        addToCart,
        updateCartQuantity,
        getCartCount,
        getCartAmount,
        isLoading,
        error
    }

    if (!isUserLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}