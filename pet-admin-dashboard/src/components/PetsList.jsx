"use client";

import { useState } from 'react';
import AddPetModal from './AddPetModal'

const initialPets = [
  {
    id: 1,
    name: "Max",
    species: "Dog",
    breed: "Golden Retriever",
    age: 3,
    status: "available",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500",
    owner: null
  },
  {
    id: 2,
    name: "Luna",
    species: "Cat",
    breed: "Persian",
    age: 2,
    status: "adopted",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500",
    owner: "Sarah Miller"
  }
];

export default function PetsList() {
  const [pets, setPets] = useState(initialPets);
  const [view, setView] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'adopted':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const GridIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" 
      />
    </svg>
  )

  const ListIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-all duration-200 ${
              view === 'grid' 
                ? 'bg-zinc-800 text-white' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <GridIcon />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-all duration-200 ${
              view === 'list' 
                ? 'bg-zinc-800 text-white' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ListIcon />
          </button>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6" />
          </svg>
          Add New Pet
        </button>
      </div>

      <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-4'}>
        {pets.map((pet) => (
          <div
            key={pet.id}
            className={`bg-zinc-900/30 border border-zinc-800/50 rounded-xl overflow-hidden hover:bg-zinc-800/30 transition-all duration-200 ${
              view === 'grid' ? '' : 'flex items-center gap-4'
            }`}
          >
            <div className={view === 'grid' ? 'aspect-square w-full relative' : 'h-24 w-24 relative'}>
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`p-4 ${view === 'grid' ? '' : 'flex-1 flex justify-between items-center'}`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg text-zinc-100">{pet.name}</h3>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium border ${getStatusColor(pet.status)}`}>
                    {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
                  </span>
                </div>
                <div className="text-sm text-zinc-400">
                  {pet.breed} • {pet.age} years old
                </div>
                {pet.owner && (
                  <div className="text-sm text-zinc-500">
                    Owner: {pet.owner}
                  </div>
                )}
              </div>
              {view === 'list' && (
                <div className="flex items-center gap-2">
                  <button className="p-2 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button className="p-2 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-red-500/10">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <AddPetModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
