import React, { useState, useEffect } from 'react';
import learningPlanApi from '../api/learningPlanApi';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

const LearningPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topics: [],
  });
  const [completedTopics, setCompletedTopics] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await learningPlanApi.getAllLearningPlans();
      // Filter plans to only show current user's plans
      const currentUserId = localStorage.getItem('userId');
      const userPlans = data.filter(plan => plan.authorId === currentUserId);
      setPlans(userPlans);
    } catch (error) {
      toast.error('Failed to fetch learning plans');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'topics') {
      setFormData(prev => ({
        ...prev,
        topics: value.split(',').map(topic => topic.trim())
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentPlan) {
      setShowUpdateConfirm(true);
    } else {
      await submitPlan();
    }
  };

  const submitPlan = async () => {
    try {
      if (currentPlan) {
        const updateData = {
          ...formData,
          authorId: localStorage.getItem('userId')
        };
        await learningPlanApi.updateLearningPlan(currentPlan.id, updateData);
        toast.success('Learning plan updated successfully');
      } else {
        await learningPlanApi.createLearningPlan(formData);
        toast.success('Learning plan created successfully');
      }
      setIsModalOpen(false);
      setShowUpdateConfirm(false);
      await fetchPlans();
      resetForm();
    } catch (error) {
      toast.error(currentPlan ? 'Failed to update plan' : 'Failed to create plan');
    }
  };

  const handleDelete = async (id) => {
    setPlanToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await learningPlanApi.deleteLearningPlan(planToDelete);
      toast.success('Learning plan deleted successfully');
      await fetchPlans();
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error('Failed to delete plan');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      topics: [],
    });
    setCurrentPlan(null);
  };

  const calculateProgress = (planId, totalTopics) => {
    const completed = completedTopics[planId] || 0;
    return Math.round((completed / totalTopics) * 100);
  };

  const handleTopicToggle = (planId, topicIndex) => {
    setCompletedTopics(prev => {
      const currentCompleted = prev[planId] || 0;
      const newCompleted = currentCompleted === topicIndex + 1 ? topicIndex : topicIndex + 1;
      return {
        ...prev,
        [planId]: newCompleted
      };
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Learning Plans
        </h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md"
        >
          Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-indigo-50">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-indigo-900">{plan.title}</h3>
              <p className="text-indigo-600 mb-4 opacity-75">{plan.description}</p>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-semibold text-indigo-500">Progress</h4>
                  <span className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {calculateProgress(plan.id, plan.topics.length)}%
                  </span>
                </div>
                <div className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-300 shadow-inner"
                    style={{ width: `${calculateProgress(plan.id, plan.topics.length)}%` }}
                  ></div>
                </div>
              </div>

              {/* Topics with checkboxes */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-indigo-500 mb-2">Topics:</h4>
                <div className="space-y-2">
                  {plan.topics.map((topic, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 cursor-pointer group hover:bg-indigo-50 p-1 rounded-lg transition-colors duration-200"
                      onClick={() => handleTopicToggle(plan.id, index)}
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-200
                        ${(completedTopics[plan.id] || 0) > index 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-transparent' 
                          : 'border-indigo-300 group-hover:border-indigo-400'}`}
                      >
                        {(completedTopics[plan.id] || 0) > index && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm transition-colors duration-200 ${(completedTopics[plan.id] || 0) > index 
                        ? 'text-indigo-600 font-medium' 
                        : 'text-gray-600 group-hover:text-indigo-600'}`}>
                        {topic}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setCurrentPlan(plan);
                    setFormData({
                      title: plan.title,
                      description: plan.description,
                      topics: plan.topics,
                    });
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="px-4 py-2 text-rose-600 hover:text-rose-700 font-medium transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        className="max-w-lg mx-auto mt-20 bg-white p-6 rounded-xl shadow-xl border border-indigo-100"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      >
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {currentPlan ? 'Edit Learning Plan' : 'Create Learning Plan'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              rows="4"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-1">
              Topics (comma-separated)
            </label>
            <input
              type="text"
              name="topics"
              value={formData.topics.join(', ')}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="px-6 py-2.5 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {currentPlan ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onRequestClose={() => setShowDeleteConfirm(false)}
        className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow-xl border border-red-100"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-red-600">Confirm Delete</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to delete this learning plan? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Delete
          </button>
        </div>
      </Modal>

      {/* Update Confirmation Modal */}
      <Modal
        isOpen={showUpdateConfirm}
        onRequestClose={() => setShowUpdateConfirm(false)}
        className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow-xl border border-indigo-100"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-indigo-600">Confirm Update</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to update this learning plan?</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowUpdateConfirm(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={submitPlan}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            Update
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default LearningPlansPage;
