import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CreateUpdatePostModal from "../components/cookingPosts/CreateUpdatePostModal";
import cookingPostApi from "../api/cookingPostApi";
import PostList from "../components/cookingPosts/PostList";

const CookingPostsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = (await cookingPostApi.getAllPosts()).reverse();
      setPosts(data);
    } catch (error) {
      toast.error("Failed to fetch posts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setPostToEdit(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePostSubmitSuccess = () => {
    fetchPosts();
    closeModal();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Learning Posts</h1>
            <p className="text-gray-600 mb-8">Share your knowledge and experiences with the community</p>
            
            {/* Search and Create Post Section */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              
              <button
                onClick={openCreateModal}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create New Post
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            <PostList
              posts={posts ?? []}
              onUpdateOrDelete={fetchPosts}
              onSubmitSuccess={handlePostSubmitSuccess}
            />
          </div>
        </div>
      </div>

      <CreateUpdatePostModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialPost={postToEdit}
        onSubmitSuccess={handlePostSubmitSuccess}
      />
    </div>
  );
};

export default CookingPostsPage;
