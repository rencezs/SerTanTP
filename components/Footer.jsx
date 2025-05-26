import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Image 
            className="w-28 md:w-32 h-auto" 
            src="/copy/Picsart_23-04-27_15-55-05-831.png"
            alt="QuickCart Logo"
            width={200}
            height={80}
            priority
          />
          <p className="mt-6 text-sm">
          At AllOff, our distinctive 'A' emblem stands for ambition and authenticity. Every piece in our collection is crafted with premium fabrics and precise tailoring, marrying timeless style with contemporary edge. Whether you're navigating city life or venturing off the beaten path, AllOff empowers you to break free from the ordinary and make every moment count.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="#">Home</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">About us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Contact us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Privacy policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>0977 745 2261</p>
              <p>alloffco@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;