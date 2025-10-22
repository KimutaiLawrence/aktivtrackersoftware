import api from './axios'

export const authAPI = {
  // Register new user
  register(data) {
    console.log('API register called with:', data) // Debug log
    return api.post('/api/v1/auth/register', data)
  },

  // Login user
  login(data) {
    console.log('API login called with:', data) // Debug log
    return api.post('/api/v1/auth/login', data)
  },

  // Get Google OAuth URL
  getGoogleAuthUrl() {
    return api.get('/api/v1/auth/google')
  },

  // Handle Google OAuth callback
  googleCallback(code) {
    return api.get('/api/v1/auth/google/callback', {
      params: { code }
    })
  },

  // Forgot password
  forgotPassword(email) {
    console.log('API forgotPassword called with:', email) // Debug log
    return api.post('/api/v1/auth/forgot-password', { email })
  },

  // Reset password
  resetPassword(data) {
    console.log('API resetPassword called with:', data) // Debug log
    return api.post('/api/v1/auth/reset-password', data)
  },

  // Change password (authenticated)
  changePassword(data) {
    console.log('API changePassword called with:', data) // Debug log
    return api.post('/api/v1/auth/change-password', data)
  },

  // Verify email
  verifyEmail(token) {
    console.log('API verifyEmail called with:', token) // Debug log
    return api.post('/api/v1/auth/verify-email', { token })
  },
}
