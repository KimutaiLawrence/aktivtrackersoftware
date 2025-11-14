<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <i class="pi pi-spin pi-spinner text-4xl text-primary-600"></i>
      <p class="mt-4 text-gray-600">Completing Google sign in...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const authStore = useAuthStore()

onMounted(async () => {
  const code = route.query.code
  if (code) {
    try {
      await authStore.handleGoogleCallback(code)
    } catch (error) {
      console.error('Google callback failed:', error)
    }
  }
})
</script>
