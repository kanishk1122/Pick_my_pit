import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../utils/Usercontext';
import { POST } from '../../Consts/apikeys';
import { useSwal } from '@utils/Customswal.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const UserPosts = () => {
  const { user } = useUser();
  const Swal = useSwal();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`${POST.GetUserPosts}/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.sessionToken}`,
          userid: user.id,
        },
      });
      setPosts(response.data.posts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to fetch user posts. Please try again later.',
      });
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await axios.delete(`${POST.Delete(postId)}`, {
          headers: {
            Authorization: `Bearer ${user.sessionToken}`,
            userid: user.id,
          },
          data: { userId: user.id } // Send userId in the request body
        });
        Swal.fire(
          'Deleted!',
          'Your post has been deleted.',
          'success'
        );
        fetchUserPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.message || 'Failed to delete post',
      });
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
  };

  const handleUpdate = async (updatedPost) => {
    try {
      const response = await axios.put(`${POST.Update(updatedPost._id)}`, updatedPost, {
        headers: {
          Authorization: `Bearer ${user.sessionToken}`,
          "Content-Type": "application/json",
          userid: user.id,
        },
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Your post has been updated successfully.',
        });
        setEditingPost(null);
        fetchUserPosts();
      }
    } catch (error) {
      console.error('Error updating post:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.message || 'Failed to update post',
      });
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (posts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-green-600">My Pet Listings</h2>
      <AnimatePresence>
        <motion.div 
          className="grid  grid-cols-2  gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handleDelete} onEdit={() => handleEdit(post)} />
          ))}
        </motion.div>
      </AnimatePresence>
      {editingPost && (
        <EditModal 
          post={editingPost} 
          onClose={() => setEditingPost(null)} 
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

const PostCard = ({ post, onDelete, onEdit }) => {
return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-48 overflow-x-auto whitespace-nowrap">
        {post?.images && post.images.map((img, index) => (
          <img 
            key={index}
            src={img} 
            alt={`${post.title} - ${index + 1}`} 
            className="inline-block h-full w-full object-cover"
            style={{ minWidth: '100%' }}
          />
        ))}
        <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 m-2 rounded-full text-sm font-bold">
          {post.type}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-semibold mb-3 text-gray-800">{post.title}</h3>
        <textarea name="" value={post.discription} className="w-full resize-none" id=""></textarea>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-sm text-gray-500">Species:</span>
            <p className="font-medium">{post.species}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Category:</span>
            <p className="font-medium">{post.category}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Price:</span>
            <p className="font-medium text-green-600">₹{post.amount}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Status:</span>
            <p className="font-medium capitalize">{post.status}</p>
          </div>
        </div>
        <div className="mb-4">
          <span className="text-sm text-gray-500">Address:</span>
          <p className="font-medium">{post.address ? `${post.address.street}, ${post.address.city}` : 'No address provided'}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Posted on: {new Date(post.date).toLocaleDateString()}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => onDelete(post._id)}
              className="brand-button bg-red-500 text-black hover:text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => onEdit(post)}
              className="brand-button bg-blue-500 text-black hover:text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EditModal = ({ post, onClose, onUpdate }) => {
  const [editedPost, setEditedPost] = useState(post);
  const [breeds, setBreeds] = useState([]);
  const Swal = useSwal();

  useEffect(() => {
    if (editedPost.species) {
      fetchBreeds(editedPost.species);
    }
  }, [editedPost.species]);

  const fetchBreeds = async (species) => {
    try {
      const response = await axios.get(`${POST.GetBreeds}/${species}`);
      if (response.data.success) {
        setBreeds(response.data.breeds);
      }
    } catch (error) {
      console.error('Error fetching breeds:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!editedPost.species || !editedPost.category) {
        throw new Error('Species and breed are required');
      }
      await onUpdate(editedPost);
      onClose();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message || 'Failed to update post. Please try again.',
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Edit Post</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={editedPost.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="discription"
              value={editedPost.discription}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Species</label>
            <input
              type="text"
              name="species"
              value={editedPost.species}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Breed</label>
            <select
              name="category"
              value={editedPost.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            >
              <option value="">Select Breed</option>
              {breeds.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              value={editedPost.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            >
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {editedPost.type === 'paid' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="amount"
                value={editedPost.amount}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                min="0"
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="container mx-auto p-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-48 bg-gray-300 animate-pulse"></div>
          <div className="p-4">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EmptyState = () => (
  <div className="container mx-auto p-4 text-center">
    <h2 className="text-3xl font-bold mb-4 text-gray-700">No Posts Yet</h2>
    <p className="text-xl text-gray-600 mb-8">You haven't created any pet listings yet.</p>
    <button className="bg-green-500 text-white px-6 py-3 rounded-full text-lg hover:bg-green-600 transition-colors">
      Create Your First Listing
    </button>
  </div>
);

export default UserPosts;
