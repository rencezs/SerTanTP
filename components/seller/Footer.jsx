import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-10">
      <div className="flex items-center gap-4">
        <Image 
            className="hidden md:block h-auto" 
            src="/copy/Picsart_23-04-27_15-55-05-831.png" 
            alt="QuickCart Logo"
            width={128}
            height={40}
        />
        <div className="hidden md:block h-7 w-px bg-gray-500/60"></div>
      </div>
      <div className="flex items-center gap-3">
        <a href="#">
          <Image src={assets.facebook_icon} alt="facebook_icon" />
        </a>
        <a href="#">
          <Image src={assets.twitter_icon} alt="twitter_icon" />
        </a>
        <a href="#">
          <Image src={assets.instagram_icon} alt="instagram_icon" />
        </a>
      </div>
    </div>
  );
};

export default Footer;