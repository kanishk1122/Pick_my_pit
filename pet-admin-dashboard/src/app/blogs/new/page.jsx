'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Editor from "../../Editor"; // Update this path

const NewBlogPost = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleSave = async () => {
    if (!title || !coverImage || !author) {
      setStatus("Please fill in all fields.");
      return;
    }

    try {
      // TODO: Implement actual save functionality
      console.log("Saving blog post:", { title, description, author, coverImage });
      setStatus("Blog post saved successfully!");
      // router.push("/blogs");
    } catch (error) {
      setStatus(`Error saving post: ${error.message}`);
      console.error("Error saving content:", error);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverImagePreview(null);
    }
  };

  const handleRemoveCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
  };

  return (
    <div className="bg-zinc-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
      <div className="p-6 bg-zinc-800 border-b border-zinc-700 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Create New Blog Post</h2>
        <button onClick={onClose} className="text-zinc-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            className="w-full px-4 py-3 rounded-xl bg-zinc-700/50 border border-zinc-600
              text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500
              transition-colors duration-300"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter blog description"
            className="w-full px-4 py-3 rounded-xl bg-zinc-700/50 border border-zinc-600
              text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500
              transition-colors duration-300 h-24 resize-none"
          />

          <div className="relative group">
            <label htmlFor="coverImage" className="block text-zinc-400 text-sm font-medium mb-2">
              Cover Image
            </label>
            <div className="relative border-2 border-dashed border-zinc-700 rounded-xl p-8
              hover:border-zinc-500 transition-colors duration-300">
              <input 
                type="file"
                id="coverImage"
                onChange={handleCoverImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto text-zinc-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-zinc-400">Drag and drop or click to upload</p>
              </div>
            </div>
            {coverImagePreview && (
              <div className="mt-4 relative group">
                <img
                  src={coverImagePreview}
                  alt="Cover Image Preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={handleRemoveCoverImage}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author name"
            className="w-full px-4 py-3 rounded-xl bg-zinc-700/50 border border-zinc-600
              text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500
              transition-colors duration-300"
          />

          <div className="bg-zinc-800 rounded-xl overflow-hidden">
            <Editor />
          </div>

          {status && (
            <div className={`p-4 rounded-xl ${status.includes('Error') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
              {status}
            </div>
          )}
        </div>
      </div>
      <div className="p-6 bg-zinc-800 border-t border-zinc-700">
        <button
          onClick={handleSave}
          className="w-full px-6 py-3 rounded-xl bg-blue-600 text-white
            hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save Blog Post
        </button>
      </div>
    </div>
  );
};

export default NewBlogPost;
