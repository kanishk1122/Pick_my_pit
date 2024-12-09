import React from 'react';
import Card from './Card.jsx';
import nd1 from '../../assets/images/normat_dog.png';
import nd2 from '../../assets/images/normal_dog_2.png';

const Index = () => {
  return (
    <div className="container mx-auto px-5 my-10">
      <h1 className="text-4xl font-bold text-center mb-10">Find Your Furry Friend!</h1>

      <div className="flex justify-evenly gap-8 items-center">
        {/* Donate and Adopt a Pet Button */}
        <div className="bg-gradient-to-r from-[#5e9ae6] to-[#4f84d3] rounded-2xl border-4 border-white shadow-lg w-full max-w-md p-6 flex flex-col items-center text-center transition-transform duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-semibold text-[#f9f9f9]">Donate and Adopt a Pet</h2>
          <p className="text-lg text-[#f9f9f9] mt-2">
            Open your heart and home to a loving pet. Make a difference today!
          </p>
          <button className="mt-4 bg-white text-[#5e9ae6] font-bold py-3 px-6 rounded-lg transition duration-300 hover:bg-[#f9f9f9] w-full">
            Go to Shop
          </button>
          <img src={nd1} className="mt-4 w-32 h-32 object-cover rounded-full shadow-md" alt="A friendly dog available for adoption" />
        </div>

        {/* Buy or Sell a Pet Button */}
        <div className="bg-gradient-to-r from-[#f0b057] to-[#e69d41] rounded-2xl border-4 border-white shadow-lg w-full max-w-md p-6 flex flex-col items-center text-center transition-transform duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-semibold text-[#f9f9f9]">Buy or Sell a Pet</h2>
          <p className="text-lg text-[#f9f9f9] mt-2">
            Looking for a new pet or want to find a loving home for your pet? We’ve got you covered!
          </p>
          <button className="mt-4 bg-white text-[#f0b057] font-bold py-3 px-6 rounded-lg transition duration-300 hover:bg-[#f9f9f9] w-full">
            Go to Shop
          </button>
          <img src={nd2} className="mt-4 w-32 h-32 object-cover rounded-full shadow-md" alt="A cute dog for sale" />
        </div>
      </div>

      {/* Card Section */}
      {/* <div className="w-full mt-10 flex overflow-x-auto gap-4 py-4">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="min-w-[200px] flex-shrink-0">
            <Card />
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Index;
