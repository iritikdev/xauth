import React from "react";

function Categories() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Current Offers */}
      <div className="relative w-full  h-60 overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
          style={{ backgroundImage: "url('/offer1.jpg')" }}
        ></div>
        <div className="relative z-10 flex flex-col h-full items-start justify-center bg-black/50 text-white text-center px-4">
          <h1 className="text-2xl font-bold mb-4">CURRENT OFFERS</h1>
          <p className="text-sm mb-4">
            Click here to know the latest current offers
          </p>
        </div>
      </div>
      {/* Current Offers */}
      <div className="relative w-full h-60 overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
          style={{ backgroundImage: "url('/offer1.jpg')" }}
        ></div>
        <div className="relative z-10 flex flex-col h-full items-start justify-center bg-black/50 text-white text-center px-4">
          <h1 className="text-2xl font-bold mb-4">CURRENT OFFERS</h1>
          <p className="text-sm mb-4">
            Click here to know the latest current offers
          </p>
        </div>
      </div>
      {/* Current Offers */}
      <div className="relative w-full h-60 overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
          style={{ backgroundImage: "url('/offer1.jpg')" }}
        ></div>
        <div className="relative z-10 flex flex-col h-full items-start justify-center bg-black/50 text-white text-center px-4">
          <h1 className="text-2xl font-bold mb-4">CURRENT OFFERS</h1>
          <p className="text-sm mb-4">
            Click here to know the latest current offers
          </p>
        </div>
      </div>
      {/* Current Offers */}
      <div className="relative w-full h-60 overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
          style={{ backgroundImage: "url('/offer1.jpg')" }}
        ></div>
        <div className="relative z-10 flex flex-col h-full items-start justify-center bg-black/50 text-white text-center px-4">
          <h1 className="text-2xl font-bold mb-4">CURRENT OFFERS</h1>
          <p className="text-sm mb-4">
            Click here to know the latest current offers
          </p>
        </div>
      </div>
    </div>
  );
}

export default Categories;
