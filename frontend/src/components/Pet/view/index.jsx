import React from "react";
import { motion } from "framer-motion";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const View = ({ pet, onChatClick }) => {
  if (!pet) {
    return (
      <div className="text-center py-20 text-2xl text-red-600">
        Pet information not available
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="md:flex">
          <div className="md:w-1/3 h-64 md:h-auto ">
            <Carousel
              showThumbs={false}
              showStatus={false}
              infiniteLoop={true}
              className="h-full"
            >
              {pet.images && pet.images.length > 0 ? (
                pet.images.map((image, index) => (
                  <div key={index} className="h-64 md:h-96">
                    <img
                      src={image}
                      alt={`${pet.title} - ${index + 1}`}
                      className=" rounded-2xl overflow-hidden object-cover h-full w-full"
                    />
                  </div>
                ))
              ) : (
                <div className="h-64 md:h-96">
                  <img
                    src="https://via.placeholder.com/400x300?text=No+Image"
                    alt="No image available"
                    className="object-cover h-full w-full"
                  />
                </div>
              )}
            </Carousel>
          </div>
          <div className="md:w-2/3 p-6">
            <div className="mb-4">
              <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                {pet.species}
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                {pet.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {pet.title}
            </h1>
            <p className="text-lg text-gray-600 mb-6">{pet.discription}</p>
            <div className="mb-6">
              <span className="text-2xl font-bold text-green-600">
                ₹{pet.amount}
              </span>
              <span className="ml-2 text-sm text-gray-500 capitalize">
                {pet.type}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Owner Details</h2>
              <div className="bg-gray-50 p-4 rounded-lg shadow">
                <p className="text-lg text-gray-800 font-medium mb-2">
                  {pet.owner.firstname} {pet.owner.lastname}
                </p>
                <div className="flex space-x-4">
                  <button
                    className="flex-1 bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors duration-300 text-lg font-semibold"
                    onClick={() => onChatClick(pet.owner)}
                  >
                    Chat with Owner
                  </button>
                  <button className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors duration-300 text-lg font-semibold">
                    Contact Owner
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default View;
