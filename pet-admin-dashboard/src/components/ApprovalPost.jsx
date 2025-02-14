'use client';
import { useState } from 'react';

const PetIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
      d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-8 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-8 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" 
    />
  </svg>
);

const NameTagIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" 
    />
  </svg>
);

const PriceTagIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
);

const mockPosts = [
  {
    id: 1,
    title: "Persian Cat for Sale",
    description: "Beautiful 1-year-old Persian cat, well-trained and friendly. Comes with all vaccination records.",
    species: "Cat",
    breed: "Persian",
    petName: "Luna",
    price: 500,
    negotiable: true,
    age: "1 year",
    status: "pending",
    sellerLocation: "Downtown, City",
    contact: "+1234567890",
    images: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500",
      // ...more images
    ],
    author: {
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      date: "2024-01-20"
    }
  }
];

const ApprovalPost = () => {
  const [posts, setPosts] = useState(mockPosts);

  const handleApprove = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? {...post, status: 'approved'} : post
    ));
  };

  const handleReject = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? {...post, status: 'rejected'} : post
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-zinc-100">Pet Sale Approvals</h2>
      
      <div className="grid gap-6">
        {posts.map((post) => (
          <div 
            key={post.id}
            className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl overflow-hidden hover:bg-zinc-800/30 transition-all duration-200"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full bg-zinc-700"
                  />
                  <div>
                    <h3 className="font-medium text-zinc-100">{post.author.name}</h3>
                    <p className="text-sm text-zinc-400">{post.author.date}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium 
                  ${post.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                    post.status === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-medium text-zinc-100 mb-2">{post.title}</h4>
                  <p className="text-zinc-300">{post.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  {/* Price Tag */}
                  <div className="bg-indigo-500/10 px-3 py-1 rounded-full text-sm text-indigo-400 border border-indigo-500/20 flex items-center font-medium">
                    <PriceTagIcon />
                    <span className="ml-2">${post.price}</span>
                    {post.negotiable && (
                      <span className="ml-2 text-xs opacity-75">(Negotiable)</span>
                    )}
                  </div>

                  {/* Pet Details */}
                  <div className="bg-zinc-800/50 px-3 py-1 rounded-full text-sm text-zinc-300 flex items-center">
                    <PetIcon />
                    <span className="ml-2">{post.species} • {post.breed}</span>
                  </div>
                  
                  {/* Age */}
                  <div className="bg-zinc-800/50 px-3 py-1 rounded-full text-sm text-zinc-300">
                    <span>{post.age}</span>
                  </div>
                </div>

                {/* Location and Contact */}
                <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {post.sellerLocation}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {post.contact}
                  </div>
                </div>

                {/* Images */}
                <div className="relative">
                  <div className={`grid ${
                    post.images.length === 1 ? 'grid-cols-1' :
                    post.images.length === 2 ? 'grid-cols-2' :
                    post.images.length >= 3 ? 'grid-cols-3' : ''
                  } gap-4 mt-4`}>
                    {post.images.slice(0, 5).map((image, index) => (
                      <div 
                        key={index} 
                        className={`relative rounded-lg overflow-hidden ${
                          post.images.length === 1 ? 'aspect-video w-2/3' :
                          post.images.length === 2 ? 'aspect-square' :
                          'aspect-square'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`Post image ${index + 1}`}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {index === 4 && post.images.length > 5 && (
                          <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                            <span className="text-white text-lg font-medium">
                              +{post.images.length - 5}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {post.images.length > 0 && (
                    <div className="absolute top-2 right-2 bg-zinc-900/90 px-2 py-1 rounded-md text-xs text-zinc-300">
                      {post.images.length}/5 images
                    </div>
                  )}
                </div>

                {/* Actions */}
                {post.status === 'pending' && (
                <div className="flex items-center space-x-4 mt-6">
                  <button
                    onClick={() => handleApprove(post.id)}
                    className="flex-1 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 
                      border border-green-500/20 hover:border-green-500/30 rounded-lg transition-colors"
                  >
                    Approve Listing
                  </button>
                  <button
                    onClick={() => handleReject(post.id)}
                    className="flex-1 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 
                      border border-red-500/20 hover:border-red-500/30 rounded-lg transition-colors"
                  >
                    Reject Listing
                  </button>
                </div>
              )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApprovalPost;
