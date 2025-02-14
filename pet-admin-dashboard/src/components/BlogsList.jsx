"use client";

const BlogsList = () => {
  const blogs = [
    {
      id: 1,
      title: "Essential Pet Care Tips",
      author: "Dr. Smith",
      date: "2024-01-15",
      status: "published"
    },
    {
      id: 2,
      title: "Best Dog Breeds for Families",
      author: "Jane Wilson",
      date: "2024-01-14",
      status: "draft"
    },
    // Add more blog posts as needed
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-zinc-100">Blog Posts</h2>
      <div className="space-y-4">
        {blogs.map((blog) => (
          <div 
            key={blog.id} 
            className="flex justify-between items-center p-4 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-all duration-200 shadow-lg"
          >
            <div className="space-y-1">
              <h3 className="font-medium text-lg text-zinc-100">{blog.title}</h3>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <span>{blog.author}</span>
                <span>•</span>
                <span>{new Date(blog.date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 text-xs rounded-full font-medium backdrop-blur-sm ${
                blog.status === 'published' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
              </span>
              <button className="p-2 hover:bg-zinc-800 rounded-lg transition-all duration-200">
                <svg className="w-5 h-5 text-zinc-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.1l-3.414.586.586-3.414 9.414-9.414z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogsList;
