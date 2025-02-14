"use client";

export default function PostCard({ post, onEdit, onDelete }) {
  return (
    <div className="group bg-zinc-900/30 border border-zinc-800/50 rounded-xl overflow-hidden hover:bg-zinc-800/30 transition-all duration-200">
      {post.image && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}
      
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-medium text-lg text-zinc-100">{post.title}</h3>
            <p className="text-sm text-zinc-400 line-clamp-2">{post.description}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(post)}
              className="p-2 hover:bg-zinc-700/50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-zinc-400 hover:text-zinc-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.1l-3.414.586.586-3.414 9.414-9.414z" />
              </svg>
            </button>
            <button 
              onClick={() => onDelete(post.id)}
              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group/delete"
            >
              <svg className="w-5 h-5 text-zinc-400 group-hover/delete:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3 text-zinc-400">
            <span>{post.author}</span>
            <span>•</span>
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
            post.status === 'published' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}>
            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
