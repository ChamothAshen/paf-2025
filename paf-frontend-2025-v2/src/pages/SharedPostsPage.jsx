import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get URL parameters
import axios from "axios";

const SharedPostsPage = () => {
  const [sharedPosts, setSharedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams(); // Get userId from URL parameters

  useEffect(() => {
    const fetchSharedPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/shared-posts/user?userId=${userId}`
        ); // Fetch posts shared by the specific user
        setSharedPosts(response.data);
      } catch (error) {
        console.error("Error fetching shared posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSharedPosts();
    } else {
      console.error("User ID not found in URL parameters.");
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return <p className="text-center mt-4">Loading shared posts...</p>;
  }

  if (sharedPosts.length === 0) {
    return <p className="text-center mt-4">No shared posts available for this user.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-4">
      {sharedPosts.map((post) => (
        <div
          key={post.id}
          className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
          <p className="text-gray-600 mt-2">{post.description}</p>
          <p className="text-sm text-gray-500 mt-4">
            Shared by: {post.userId || "Anonymous"}
          </p>
          <p className="text-sm text-gray-500">
            Shared at: {new Date(post.sharedAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SharedPostsPage;