"use client"
import React from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";


const Navbar = () => {

  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk();

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <div className="flex flex-col items-center cursor-pointer w-28 md:w-32" onClick={() => router.push('/') }>
        <Image
          src="/copy/Picsart_23-04-27_15-55-05-831.png"
          alt="AllOff Logo"
          width={128}
          height={40}
        />
        <span className="font-bold text-base md:text-lg text-gray-800 leading-none">All Off</span>
        <span className="text-xs md:text-sm text-gray-500 -mt-1">Dreams To Reality</span>
      </div>
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Shop
        </Link>
        <Link href="/SecondPage.html" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/ContactAllOf.html" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}

      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        {
        user 
        ? <UserButton>
            <UserButton.MenuItems> 
              <UserButton.Action label="Cart" labelIcon={<CartIcon/>} onClick={() => router.push('/cart')}/>
            </UserButton.MenuItems>
            <UserButton.MenuItems> 
              <UserButton.Action label="My Orders" labelIcon={<BagIcon/>} onClick={() => router.push('/my-orders')}/>
            </UserButton.MenuItems>
          </UserButton>
        : <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>}
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}
        {
        user 
        ? <UserButton>
            <UserButton.MenuItems> 
              <UserButton.Action label="Home" labelIcon={<HomeIcon/>} onClick={() => router.push('/cart')}/>
            </UserButton.MenuItems>
            <UserButton.MenuItems> 
              <UserButton.Action label="Products" labelIcon={<BoxIcon/>} onClick={() => router.push('/all-products')}/>
            </UserButton.MenuItems>

            <UserButton.MenuItems> 
              <UserButton.Action label="My Orders" labelIcon={<BagIcon/>} onClick={() => router.push('/my-orders')}/>
            </UserButton.MenuItems>
          </UserButton>
        : <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>}
      </div>
    </nav>
  );
};

export default Navbar;