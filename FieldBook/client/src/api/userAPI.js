// API endpoints
const API_BASE_URL = 'http://localhost:3000';

// User authentication APIs
export const userAPI = {
  // Register a new user
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // Login user
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  // Get user profile
  getProfile: async (userId, token) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  },

  // Update user profile
  updateProfile: async (userId, userData, token) => {
    const response = await fetch(`${API_BASE_URL}/users/profile/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, ...userData }),
    });
    return response.json();
  },

  // Get all users (Admin only)
  getAllUsers: async (token) => {
    const response = await fetch(`${API_BASE_URL}/users/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Get users by role (Admin only)
  getUsersByRole: async (role, token) => {
    const response = await fetch(`${API_BASE_URL}/users/role/${role}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Delete user (Admin only)
  deleteUser: async (userId, token) => {
    const response = await fetch(`${API_BASE_URL}/users/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  },

  // Deactivate user (Admin only)
  deactivateUser: async (userId, token) => {
    const response = await fetch(`${API_BASE_URL}/users/deactivate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  },
};

export default userAPI;
