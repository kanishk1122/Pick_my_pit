"use client";

import { useState } from 'react';
import ImageUploader from './ImageUploader';

export default function NewPostForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    image: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-zinc-300">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 text-zinc-100"
            placeholder="Enter post title"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="author" className="block text-sm font-medium text-zinc-300">
            Author Name
          </label>
          <input
            type="text"
            id="author"
            value={formData.author}
            onChange={e => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 text-zinc-100"
            placeholder="Enter author name"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-zinc-300">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 text-zinc-100"
            placeholder="Write your post content here..."
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-300">
            Featured Image
          </label>
          <ImageUploader 
            onImageChange={(file) => setFormData({ ...formData, image: file })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Publish Post
        </button>
      </div>
    </form>
  );
}
