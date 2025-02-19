import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { POST } from '../../Consts/apikeys';
import '../../styles/rangeSlider.css';

const FilterSidebar = ({ onFilterChange, initialFilters }) => {
  const [filters, setFilters] = useState({
    species: '',
    breed: '', // This will use the category field from backend
    type: '',
    minPrice: '0',
    maxPrice: '100000',
    ...initialFilters
  });

  const [breeds, setBreeds] = useState([]);
  const [isLoadingBreeds, setIsLoadingBreeds] = useState(false);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const fetchBreeds = async () => {
      if (!filters.species) {
        setBreeds([]);
        return;
      }

      try {
        setIsLoadingBreeds(true);
        const response = await axios.get(`${POST.Breeds}/${filters.species}`);
        if (response.data.success) {
          setBreeds(response.data.breeds);
        }
      } catch (error) {
        console.error('Error fetching breeds:', error);
      } finally {
        setIsLoadingBreeds(false);
      }
    };

    fetchBreeds();
  }, [filters.species]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'species' && { breed: '' }), // Reset breed when species changes
      ...(name === 'type' && value !== 'paid' && { minPrice: '0', maxPrice: '100000' }) // Reset price range when switching to free
    }));
  };

  const handlePriceChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [name]: value
      };
      
      // Ensure minPrice doesn't exceed maxPrice
      if (name === 'minPrice' && parseInt(value) > parseInt(prev.maxPrice)) {
        newFilters.maxPrice = value;
      }
      
      // Ensure maxPrice doesn't go below minPrice
      if (name === 'maxPrice' && parseInt(value) < parseInt(prev.minPrice)) {
        newFilters.minPrice = value;
      }
      
      return newFilters;
    });
  }, []);

  const formatPrice = (value) => {
    return `₹${parseInt(value).toLocaleString('en-IN')}`;
  };

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [name]: value
      };
      
      // Ensure minPrice doesn't exceed maxPrice
      if (name === 'minPrice' && parseInt(value) > parseInt(prev.maxPrice)) {
        newFilters.maxPrice = value;
      }
      
      // Ensure maxPrice doesn't go below minPrice
      if (name === 'maxPrice' && parseInt(value) < parseInt(prev.minPrice)) {
        newFilters.minPrice = value;
      }
      
      return newFilters;
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    onFilterChange(debouncedFilters);
  }, [debouncedFilters, onFilterChange]);

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-[260px] h-full pt-10 min-h-screen bg-white"
    >
      <h2 className="text-2xl font-bold mb-6 text-green-600 text-center">Filter Pets</h2>
      <ul className="w-full justify-center items-center flex flex-col gap-4 mt-2 px-3">
        {/* Species Selection */}
        <li className="w-full">
          <label className="block text-sm font-medium mb-1">Species</label>
          <select
            name="species"
            value={filters.species}
            onChange={handleInputChange}
            className="brand-button w-full h-full flex justify-center gap-3 items-center"
          >
            <option value="">All Species</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
            <option value="other">Other</option>
          </select>
        </li>

        {/* Breed Selection - Only shows when species is selected */}
        {filters.species && (
          <li className="w-full">
            <label className="block text-sm font-medium mb-1">Breed</label>
            <select
              name="breed" // This will map to category in the backend
              value={filters.breed}
              onChange={handleInputChange}
              disabled={isLoadingBreeds}
              className="brand-button w-full h-full flex justify-center gap-3 items-center"
            >
              <option value="">All Breeds</option>
              {isLoadingBreeds ? (
                <option disabled>Loading breeds...</option>
              ) : (
                breeds.map(breed => (
                  <option key={breed} value={breed}>
                    {breed.charAt(0).toUpperCase() + breed.slice(1)}
                  </option>
                ))
              )}
            </select>
          </li>
        )}

        {/* Type Selection (Free/Paid) */}
        <li className="w-full">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleInputChange}
            className="brand-button w-full h-full flex justify-center gap-3 items-center"
          >
            <option value="">All Categories</option>
            <option value="free">Adoption</option>
            <option value="paid">Sale</option>
          </select>
        </li>

    
        {/* Show price range only if type is 'paid' */}
        {filters.type !== 'free' && (
          <li className="w-full">
            <label className="block text-sm font-medium mb-1">Price Range</label>
            <div className="px-2">
              <div className="flex justify-between mb-2">
                <span>{formatPrice(filters.minPrice)}</span>
                <span>{formatPrice(filters.maxPrice)}</span>
              </div>
              <div className="relative h-1 bg-gray-200 rounded-full">
                <div
                  className="absolute h-full bg-green-500 rounded-full"
                  style={{
                    left: `${(filters.minPrice / 100000) * 100}%`,
                    right: `${100 - (filters.maxPrice / 100000) * 100}%`
                  }}
                />
              </div>
              <div className="relative">
                <input
                  type="range"
                  name="minPrice"
                  min="0"
                  max="100000"
                  step="1000"
                  value={filters.minPrice}
                  onChange={handleRangeChange}
                  className="absolute w-full -top-1 h-1 appearance-none bg-transparent pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                />
                <input
                  type="range"
                  name="maxPrice"
                  min="0"
                  max="100000"
                  step="1000"
                  value={filters.maxPrice}
                  onChange={handleRangeChange}
                  className="absolute w-full -top-1 h-1 appearance-none bg-transparent pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                />
              </div>
              <div className="flex justify-between mt-4">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleRangeChange}
                  className="w-24 px-2 py-1 text-sm border rounded"
                  min="0"
                  max={filters.maxPrice}
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleRangeChange}
                  className="w-24 px-2 py-1 text-sm border rounded"
                  min={filters.minPrice}
                  max="100000"
                />
              </div>
            </div>
          </li>
        )}

        {/* Apply Filters Button */}
        <li className="w-full">
          <button
            onClick={() => onFilterChange(filters)}
            className="brand-button w-full h-full flex justify-center gap-3 items-center bg-green-500 hover:text-white duration-200 hover:bg-green-600"
          >
            Apply Filters
          </button>
        </li>
      </ul>
    </motion.div>
  );
};

export default FilterSidebar;
