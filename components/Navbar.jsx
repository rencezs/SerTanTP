"use client"
import React, { useState } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";


const Navbar = () => {

  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 relative">
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
        <Link href="/" className="group relative transition">
          <span className="hover:text-orange-600 transition">Home</span>
          <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 rounded transition-all duration-300"></span>
        </Link>
        <Link href="/all-products" className="group relative transition">
          <span className="hover:text-orange-600 transition">Shop</span>
          <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 rounded transition-all duration-300"></span>
        </Link>
        <Link href="/SecondPage.html" className="group relative transition">
          <span className="hover:text-orange-600 transition">About Us</span>
          <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 rounded transition-all duration-300"></span>
        </Link>
        <Link href="/ContactAllOf.html" className="group relative transition">
          <span className="hover:text-orange-600 transition">Contact</span>
          <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 rounded transition-all duration-300"></span>
        </Link>

        {isSeller && <button onClick={() => router.push('/seller')} className="group relative text-xs border px-4 py-1.5 rounded-full transition overflow-hidden">
          <span className="hover:text-orange-600 transition">Seller Dashboard</span>
          <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 rounded transition-all duration-300"></span>
        </button>}

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

      <div className="md:hidden flex items-center gap-3">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 focus:outline-none">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
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
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg z-50 flex flex-col items-center py-4 md:hidden animate-fade-in">
          <Link href="/" className="py-2 w-full text-center hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/all-products" className="py-2 w-full text-center hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
          <Link href="/SecondPage.html" className="py-2 w-full text-center hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
          <Link href="/ContactAllOf.html" className="py-2 w-full text-center hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          {isSeller && <button onClick={() => {router.push('/seller'); setMobileMenuOpen(false);}} className="py-2 w-full text-center hover:bg-gray-100">Seller Dashboard</button>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;