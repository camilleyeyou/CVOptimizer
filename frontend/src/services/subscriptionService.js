import api from './api';

const subscriptionService = {
  // Get current subscription details
  getSubscription: async () => {
    try {
      const response = await api.get('/subscriptions');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch subscription details' };
    }
  },

  // Subscribe to a premium plan
  subscribe: async (plan) => {
    try {
      const response = await api.post('/subscriptions/subscribe', { plan });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to subscribe' };
    }
  },

  // Cancel subscription
  cancelSubscription: async () => {
    try {
      const response = await api.post('/subscriptions/cancel');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to cancel subscription' };
    }
  },
};

export default subscriptionService;