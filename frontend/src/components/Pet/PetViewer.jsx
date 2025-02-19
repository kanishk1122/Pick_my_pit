import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { POST } from '../../Consts/apikeys';
import { useUser } from '../../utils/Usercontext';
import { ChatProvider } from '../../context/ChatContext';
import ChatModal from '../Chat/ChatModal';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './PetViewer.css'; // This import should now work

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
          <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : pet ? (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 pet-carousel">
                <Carousel showArrows={true} showThumbs={false} infiniteLoop={true}>
                  {pet.images.map((image, index) => (
                    <div key={index}>
                      <img src={image} alt={`${pet.title} - image ${index + 1}`} className="object-cover h-full w-full" />
                    </div>
                  ))}
                </Carousel>
              </div>
              <div className="md:w-1/2 p-8 pet-details">
                <h1 className="text-3xl font-bold text-green-600 mb-4">{pet.title}</h1>
                <div className="mb-4">
                  <span className={`pet-tag ${pet.type === 'free' ? 'adoption' : 'sale'}`}>
                    {pet.type === 'free' ? 'For Adoption' : 'For Sale'}
                  </span>
                  {pet.type === 'paid' && (
                    <span className="text-2xl font-bold text-green-600 ml-2">
                      ₹{pet.amount.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-6">{pet.discription}</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Species</h3>
                    <p className="text-lg">{pet.species}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Breed</h3>
                    <p className="text-lg">{pet.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Status</h3>
                    <p className="text-lg capitalize">{pet.status}</p>
                  </div>
                  {pet.address && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">Location</h3>
                      <p className="text-lg">{`${pet.address.city}, ${pet.address.state}`}</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleChatClick}
                  className="brand-button hover:bg-green-500  hover:text-white duration-200 w-full"
                >
                  Contact Owner
                </button>
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
