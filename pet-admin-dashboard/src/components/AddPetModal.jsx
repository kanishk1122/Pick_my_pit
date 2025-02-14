'use client'
import { useState } from 'react'
import ImageUploader from './ImageUploader'

export default function AddPetModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    description: '',
    image: null
  })

  if (!isOpen) return null

  return (
    <div className=" overflow-hidden fixed bottom-2 -top-5 inset-0 z-50  m-2  mb-2  bg-zinc-900 rounded-xl border-2 border-white backdrop-blur-sm">
      <div className=" flex flex-col">
        {/* Header */}
        <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0">
          <div className="flex items-center justify-between max-w-6xl mx-auto px-4 py-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Add New Pet</h2>
              <p className="text-zinc-400 text-sm">Enter pet details below</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Save Pet
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Form */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-zinc-400">Name</span>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-lg bg-zinc-800/50 border border-zinc-700 px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Enter pet name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-zinc-400">Species</span>
                      <select
                        className="mt-1 block w-full rounded-lg bg-zinc-800/50 border border-zinc-700 px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        value={formData.species}
                        onChange={(e) => setFormData({...formData, species: e.target.value})}
                      >
                        <option value="">Select species</option>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="bird">Bird</option>
                        <option value="other">Other</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-zinc-400">Age</span>
                      <input
                        type="number"
                        className="mt-1 block w-full rounded-lg bg-zinc-800/50 border border-zinc-700 px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="Age in years"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-zinc-400">Breed</span>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-lg bg-zinc-800/50 border border-zinc-700 px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Enter breed"
                      value={formData.breed}
                      onChange={(e) => setFormData({...formData, breed: e.target.value})}
                    />
                  </label>

                  <label className="block">
                    <span className="text-zinc-400">Description</span>
                    <textarea
                      className="mt-1 block w-full rounded-lg bg-zinc-800/50 border border-zinc-700 px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[120px]"
                      placeholder="Enter pet description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </label>
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div>
                <span className="text-zinc-400 block mb-4">Pet Image</span>
                <ImageUploader
                  onImageChange={(file) => setFormData({...formData, image: file})}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
