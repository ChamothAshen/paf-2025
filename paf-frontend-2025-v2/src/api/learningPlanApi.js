import axiosInstance from '../utils/axiosConfig';

const learningPlanApi = {
  getAllLearningPlans: async () => {
    try {
      const response = await axiosInstance.get('/learning-plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching learning plans:', error);
      throw error;
    }
  },

  getLearningPlanById: async (id) => {
    try {
      const response = await axiosInstance.get(`/learning-plans/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching learning plan:', error);
      throw error;
    }
  },

  createLearningPlan: async (planData) => {
    try {
      const response = await axiosInstance.post('/learning-plans', {
        ...planData,
        authorId: localStorage.getItem('userId'),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating learning plan:', error);
      throw error;
    }
  },

  updateLearningPlan: async (id, planData) => {
    try {
      const response = await axiosInstance.put(`/learning-plans/${id}`, planData);
      return response.data;
    } catch (error) {
      console.error('Error updating learning plan:', error);
      throw error;
    }
  },

  deleteLearningPlan: async (id) => {
    try {
      await axiosInstance.delete(`/learning-plans/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting learning plan:', error);
      throw error;
    }
  }
};

export default learningPlanApi;
