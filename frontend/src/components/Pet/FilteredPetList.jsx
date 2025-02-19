import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Pagination from './Pagination';

const FilteredPetList = ({ pets, pageInfo, onPageChange }) => {
  if (!pets.length) {
    return (
      <div className="text-center text-gray-600 mt-8">
        No pets found matching your criteria
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet, index) => (
          <motion.div
            key={pet._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/pet/${pet._id}`} className="block">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <img
                    src={pet.images[0]}
                    alt={pet.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 m-2">
                    <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${
                      pet.type === 'free' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                    }`}>
                      {pet.type === 'free' ? 'Adoption' : 'For Sale'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{pet.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{pet.discription}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 font-medium">{pet.species} - {pet.category}</span>
                    {pet.type === 'paid' && (
                      <span className="text-green-600 font-bold">₹{pet.amount.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  {pet.address && (
                    <div className="mt-2 text-xs text-gray-500">
                      <i className="fas fa-map-marker-alt mr-1"></i>
                      {pet.address.city}, {pet.address.state}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      {pageInfo && (
        <Pagination
          currentPage={pageInfo.currentPage}
          totalPages={pageInfo.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default FilteredPetList;