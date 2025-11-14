import api from './axios'

export const authAPI = {
  // Register new user
  register(data) {
    return api.post('/api/v1/auth/register', data)
  },

  // Login user
  login(data) {
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
    return api.post('/api/v1/auth/forgot-password', { email })
  },

  // Reset password
  resetPassword(data) {
    return api.post('/api/v1/auth/reset-password', data)
  },

  // Change password (authenticated)
  changePassword(data) {
    return api.post('/api/v1/auth/change-password', data)
  },

  // Verify email
  verifyEmail(token) {
    return api.post('/api/v1/auth/verify-email', { token })
  },
}
