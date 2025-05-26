import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const products = [
  {
    id: 1,
    image: "/copy/FeatureP1.jpg",
    title: "Urban Explorers",
    description: "Discover bold streetwear for modern explorers.",
  },
  {
    id: 2,
    image: "/copy/FeatureP2.jpg",
    title: "Effortless Cool",
    description: "Elevate your look with versatile eyewear essentials.",
  },
  {
    id: 3,
    image: "/copy/FeatureP3.jpg",
    title: "Command the City Streets",
    description: "Shop premium urban gear for work, play, and beyond.",
  },
];

const FeaturedProduct = () => {
  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured Products</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
        {products.map(({ id, image, title, description }) => (
          <div key={id} className="relative group bg-gray-100 rounded-lg overflow-hidden min-h-[300px]">
            <div className="relative w-full h-full flex items-center justify-center p-8">
              <Image
                src={image}
                alt={title}
                width={400}
                height={400}
                priority
                className="group-hover:brightness-75 transition duration-300 object-contain max-h-[300px]"
              />
            </div>
            <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
              <p className="font-medium text-xl lg:text-2xl">{title}</p>
              <p className="text-sm lg:text-base leading-5 max-w-60">
                {description}
              </p>
              <button className="flex items-center gap-1.5 bg-orange-600 px-4 py-2 rounded">
                Buy now <Image className="h-3 w-3" src={assets.redirect_icon} width={12} height={12} alt="Redirect Icon" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
