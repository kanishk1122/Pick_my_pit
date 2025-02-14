'use client'
import React, { useState } from "react";
import NewBlogPost from "./new/page";

export default function BlogsLayout({ children }) {
  const [showNewPost, setShowNewPost] = useState(false);

  const handleNewPostClick = () => {
    setShowNewPost(true);
  };

  return (
    <div className="min-h-screen ">
      <nav className="bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-800/50 p-4 sticky top-20  z-10 rounded-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Pet Blog Management
          </h1>
          <button
            onClick={handleNewPostClick} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 backdrop-blur-sm">
          {children}
        </div>
      </main>
      {showNewPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <NewBlogPost onClose={() => setShowNewPost(false)} />
        </div>
      )}
    </div>
  );
}
