import React from "react";
import Image from "next/image"

export default function Menu() {
  return (
    <div
      className="relative bg-gray-100 py-16"
      style={{ backgroundImage: "url(/patron.png)" }}
    >
      <div className="absolute inset-0 bg-white opacity-80 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Nuestro Menú
          </h2>
        </div>
        <div className="flex flex-col items-center mt-10 gap-10">
          <Image
            src="/menu/1.webp"
            alt="Didi Food Logo"
            width={880}
            height={1800}
            className="object-contain"
          />
          <Image 
            src="/menu/2.webp"
            alt="Didi Food Logo"
            width={880}
            height={1800}
            className="object-contain"
            />
        </div>
      </div>
    </div>
  );
}
