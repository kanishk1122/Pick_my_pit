import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { POST } from '../../Consts/apikeys';
import { useUser } from '../../utils/Usercontext';
import { ChatProvider } from '../../context/ChatContext';
import ChatModal from '../Chat/ChatModal';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './styles/petCard.css';

const PetViewer = () => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { id } = useParams();
  const { user } = useUser();

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await axios.get(`${POST.GetOne(id)}`);
        setPet(response.data.post);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pet details:', error);
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const handleChatClick = () => {
    setIsChatOpen(true);
  };

  const handleSendMessage = async (message) => {
    try {
      // Implement the API call to send a message
      // await axios.post('/api/messages', { recipientId: pet.owner._id, message });
      console.log('Message sent:', message);
      // You might want to update the UI to show the sent message
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <ChatProvider>
      <div className="container mx-auto p-4">
        {loading ? (
          <div className="h-screen flex items-center justify-center text-2xl text-gray-600">Loading...</div>
        ) : pet ? (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <Carousel showThumbs={false} infiniteLoop useKeyboardArrows autoPlay>
                  {pet.images.map((image, index) => (
                    <div key={index}>
                      <img className="h-48 w-full object-cover md:w-48" src={image} alt={pet.title} />
                    </div>
                  ))}
                </Carousel>
              </div>
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{pet.species} - {pet.category}</div>
                <h2 className="block mt-1 text-lg leading-tight font-medium text-black">{pet.title}</h2>
                <p className="mt-2 text-gray-500">{pet.discription}</p>
                <div className="mt-4">
                  <span className={`inline-block px-3 py-1 text-sm font-semibold mr-2 mb-2 ${
                    pet.type === 'free' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'
                  } rounded-full`}>
                    {pet.type === 'free' ? 'For Adoption' : 'For Sale'}
                  </span>
                  {pet.type === 'paid' && (
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      ₹{pet.amount.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="text-md font-semibold">Details:</h3>
                  <ul className="list-disc list-inside mt-2">
                    <li>Species: {pet.species}</li>
                    <li>Breed: {pet.category}</li>
                    <li>Status: {pet.status}</li>
                    {pet.address && (
                      <li>Location: {`${pet.address.city}, ${pet.address.state}`}</li>
                    )}
                  </ul>
                </div>
                <div className="mt-6">
                  <button
                    onClick={handleChatClick}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Contact Owner
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-screen flex items-center justify-center text-2xl text-red-600">Pet not found</div>
        )}
      </div>
      {pet && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          recipient={pet.owner}
          currentUser={user}
        />
      )}
    </ChatProvider>
  );
};

export default PetViewer;