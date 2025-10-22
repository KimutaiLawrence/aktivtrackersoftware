import api from './axios'

export const usersAPI = {
  // Get current user profile
  getCurrentUser() {
    return api.get('/api/v1/users/me')
  },

  // Upload profile image
  uploadProfileImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/api/v1/users/me/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Delete profile image
  deleteProfileImage() {
    return api.delete('/api/v1/users/me/profile-image')
  },

  // Get all users (Admin only)
  getAllUsers(params = {}) {
    return api.get('/api/v1/users/', { params })
  },

  // Create user (Admin only)
  createUser(data) {
    return api.post('/api/v1/users/', data)
  },

  // Get user by ID
  getUserById(userId) {
    return api.get(`/api/v1/users/${userId}`)
  },

  // Update user
  updateUser(userId, data) {
    return api.put(`/api/v1/users/${userId}`, data)
  },

  // Delete user
  deleteUser(userId) {
    return api.delete(`/api/v1/users/${userId}`)
  },

  // Activate user
  activateUser(userId) {
    return api.patch(`/api/v1/users/${userId}/activate`)
  },

  // Deactivate user
  deactivateUser(userId) {
    return api.patch(`/api/v1/users/${userId}/deactivate`)
  },

  // Verify user
  verifyUser(userId) {
    return api.patch(`/api/v1/users/${userId}/verify`)
  },

  // Update user role
  updateUserRole(userId, role) {
    return api.patch(`/api/v1/users/${userId}/role`, { role })
  },

  // Get user stats
  getUserStats() {
    return api.get('/api/v1/users/stats/summary')
  },
}
