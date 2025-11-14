<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <i class="pi pi-spin pi-spinner text-4xl text-primary-600"></i>
      <p class="mt-4 text-gray-600">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const message = ref('Completing Google sign in...')

onMounted(async () => {
  // Check if we have tokens from backend redirect
  const accessToken = route.query.access_token
  const refreshToken = route.query.refresh_token
  
  // Check if we have error
  const error = route.query.error
  
  if (error) {
    message.value = 'Authentication failed. Redirecting to login...'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: route.query.message || 'Google authentication failed',
      life: 5000
    })
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    return
  }
  
  if (accessToken && refreshToken) {
    try {
      // Store tokens directly in the store and localStorage
      authStore.accessToken.value = accessToken
      authStore.refreshToken.value = refreshToken
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)
      
      // Fetch user info
      await authStore.fetchCurrentUser()
      
      message.value = 'Sign in successful! Redirecting...'
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Signed in with Google successfully',
        life: 3000
      })
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (error) {
      console.error('Failed to complete Google sign in:', error)
      message.value = 'Failed to complete sign in. Redirecting to login...'
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to complete Google authentication',
        life: 5000
      })
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  } else {
    // Fallback: if we have code, use the old method
    const code = route.query.code
    if (code) {
      try {
        await authStore.handleGoogleCallback(code)
        message.value = 'Sign in successful! Redirecting...'
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } catch (error) {
        console.error('Google callback failed:', error)
        message.value = 'Authentication failed. Redirecting to login...'
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } else {
      // No tokens or code, redirect to login
      message.value = 'Invalid callback. Redirecting to login...'
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  }
})
</script>
