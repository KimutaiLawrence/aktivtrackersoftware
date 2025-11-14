import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI, usersAPI } from '../api'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const accessToken = ref(localStorage.getItem('access_token') || null)
  const refreshToken = ref(localStorage.getItem('refresh_token') || null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isPremium = computed(() => user.value?.is_premium || user.value?.role === 'premium_user')

  // Actions
  async function login(credentials) {
    try {
      loading.value = true
      error.value = null
      const response = await authAPI.login(credentials)

      const { access_token, refresh_token } = response.data

      accessToken.value = access_token
      refreshToken.value = refresh_token

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)

      await fetchCurrentUser()

      router.push('/dashboard')
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    try {
      loading.value = true
      error.value = null
      const response = await authAPI.register(userData)

      // After registration, login automatically
      if (response.data) {
        await login({
          email: userData.email,
          password: userData.password
        })
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null

    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')

    router.push('/login')
  }

  async function handleLogout() {
    await logout()
  }

  async function fetchCurrentUser() {
    try {
      const response = await usersAPI.getCurrentUser()
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
      return response.data
    } catch (err) {
      console.error('Failed to fetch current user:', err)
      throw err
    }
  }

  async function getGoogleAuthUrl() {
    try {
      const response = await authAPI.getGoogleAuthUrl()
      return response.data.authorization_url
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to get Google auth URL'
      throw err
    }
  }

  async function handleGoogleCallback(code) {
    try {
      loading.value = true
      error.value = null
      const response = await authAPI.googleCallback(code)

      const { access_token, refresh_token } = response.data

      accessToken.value = access_token
      refreshToken.value = refresh_token

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)

      await fetchCurrentUser()

      router.push('/dashboard')
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Google authentication failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function forgotPassword(email) {
    try {
      loading.value = true
      error.value = null
      const response = await authAPI.forgotPassword(email)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to send reset email'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function resetPassword(data) {
    try {
      loading.value = true
      error.value = null
      const response = await authAPI.resetPassword(data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to reset password'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function changePassword(data) {
    try {
      loading.value = true
      error.value = null
      const response = await authAPI.changePassword(data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to change password'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function verifyEmail(token) {
    try {
      loading.value = true
      error.value = null
      const response = await authAPI.verifyEmail(token)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Email verification failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Initialize user from localStorage if available
  function initializeAuth() {
    const storedUser = localStorage.getItem('user')
    if (storedUser && accessToken.value) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (err) {
        console.error('Failed to parse stored user:', err)
        logout()
      }
    }
  }

  return {
    // State
    user,
    accessToken,
    refreshToken,
    loading,
    error,
    // Getters
    isAuthenticated,
    isAdmin,
    isPremium,
    // Actions
    login,
    register,
    logout,
    fetchCurrentUser,
    getGoogleAuthUrl,
    handleGoogleCallback,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyEmail,
    initializeAuth,
    handleLogout,
  }
})
