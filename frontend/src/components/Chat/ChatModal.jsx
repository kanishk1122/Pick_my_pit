import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatContext } from '../../context/ChatContext';

const ChatModal = ({ isOpen, onClose, recipient, currentUser }) => {
  const [message, setMessage] = useState('');
  const { chatRooms, joinChatRoom, leaveChatRoom, sendMessage, connectionError } = useChatContext();
  const roomId = currentUser && recipient ? [currentUser.id, recipient._id].sort().join('-') : null;

  useEffect(() => {
    if (isOpen && roomId) {
      joinChatRoom(roomId);
    }
    return () => {
      if (roomId) {
        leaveChatRoom(roomId);
      }
    };
  }, [isOpen, roomId, joinChatRoom, leaveChatRoom]);

  const handleSend = () => {
    if (message.trim() && roomId) {
      sendMessage(roomId, message, currentUser.id);
      setMessage('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Chat with {recipient.firstname}</h2>
              {connectionError ? (
                <div className="text-red-500 mb-4">{connectionError}</div>
              ) : (
                <>
                  <div className="mb-4 h-64 overflow-y-auto bg-gray-100 p-4 rounded">
                    {chatRooms[roomId] && chatRooms[roomId].map((msg, index) => (
                      <div key={index} className={`mb-2 ${msg.sender === currentUser.id ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block p-2 rounded-lg ${msg.sender === currentUser.id ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                          {msg.message}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-grow border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                      placeholder="Type your message..."
                    />
                    <button
                      onClick={handleSend}
                      className="bg-green-500 text-white px-6 py-2 rounded-r-lg hover:bg-green-600 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="bg-gray-100 px-6 py-4 flex justify-end">
              <button
                onClick={() => {
                  onClose();
                }}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;
