import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { POST } from '../../Consts/apikeys';
import { motion } from 'framer-motion';

const PaidPetList = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(POST.GetPaid);
        setPets(response.data.posts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching paid pets:', error);
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Companion Pets Seeking New Homes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pets.map((pet) => (
          <motion.div
            key={pet._id}
            whileHover={{ scale: 1.03 }}
            className="bg-blue-50 rounded-lg shadow-lg overflow-hidden transition-shadow hover:shadow-xl"
          >
            <img 
              src={pet.images[0] || 'https://via.placeholder.com/300x200'}
              alt={pet.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2 text-blue-800">{pet.title}</h2>
              <p className="text-blue-600 mb-2">{pet.species} - {pet.category}</p>
              <p className="text-xl font-bold text-blue-600 mb-4">₹{pet.amount}</p>
              <Link 
                to={`/pet/${pet._id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PaidPetList;
