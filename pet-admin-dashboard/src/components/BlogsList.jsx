"use client";
import { useState, useEffect } from "react";

export default function BlogsList() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Mock data - in a real app, you'd fetch this from an API
    const mockBlogs = [
      {
        id: 1,
        title: "Caring for Senior Pets",
        author: "Dr. Smith",
        date: "2024-01-15", // Use ISO format for consistency
        category: "Pet Health",
      },
      {
        id: 2,
        title: "Best Toys for Active Dogs",
        author: "Jane Doe",
        date: "2024-01-10",
        category: "Products",
      },
      {
        id: 3,
        title: "Understanding Cat Behavior",
        author: "Feline Expert",
        date: "2024-01-05",
        category: "Behavior",
      },
    ];

    setBlogs(mockBlogs);
  }, []);

  // Format date consistently for all environments
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Use explicit formatting that doesn't depend on locale
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="flex justify-between items-center p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800/80 transition-all duration-200"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-zinc-100">{blog.title}</h3>
              <span className="px-2 py-0.5 bg-zinc-700 text-xs rounded-full text-zinc-300">
                {blog.category}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              By {blog.author} • {formatDate(blog.date)}
            </p>
          </div>
          <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-all duration-200">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          </button>
        </div>
      ))}

      {blogs.length === 0 && (
        <div className="text-center py-4 text-zinc-500">
          No blog posts available.
        </div>
      )}

      <button className="w-full mt-4 py-2 text-zinc-400 hover:text-white bg-zinc-800/70 hover:bg-zinc-800 rounded-lg transition-all duration-200 text-sm">
        View All Posts
      </button>
    </div>
  );
}
