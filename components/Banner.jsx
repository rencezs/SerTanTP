import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 bg-[#E6E9F2] my-16 rounded-xl overflow-hidden">
      <Image
        className="w-56 h-auto object-contain"
        src="/copy/group3-removebg-preview.png"
        alt="Featured Product"
        width={200}
        height={200}
      />
      <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-semibold max-w-[290px]">
         Unleash Your Edge With Relentless Style 
        </h2>
        <p className="max-w-[343px] font-medium text-gray-800/60">
        Discover AllOff’s fearless tees crafted to amplify individuality, fuel passion, and ignite confidence every day.
        </p>
        <button className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-orange-600 rounded text-white">
          Buy now
          <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon_white} width={12} height={12} alt="arrow_icon_white" />
        </button>
      </div>
      <div className="hidden md:flex gap-4 pr-8">
        <Image
          className="w-48 h-auto object-contain"
          src="/copy/group8.png"
          alt="Featured Product"
          width={180}
          height={180}
        />
        <Image
          className="w-48 h-auto object-contain"
          src="/copy/group10.png"
          alt="Featured Product"
          width={180}
          height={180}
        />
      </div>
      <div className="md:hidden">
        <Image
          className="w-48 h-auto object-contain"
          src="/copy/group8.png"
          alt="Featured Product"
          width={180}
          height={180}
        />
      </div>
    </div>
  );
};

export default Banner;