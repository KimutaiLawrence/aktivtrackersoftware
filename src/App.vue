<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import Toast from 'primevue/toast'

const authStore = useAuthStore()

onMounted(() => {
  // Initialize auth from localStorage
  authStore.initializeAuth()
})
</script>

<template>
  <div id="app" class="min-h-screen">
    <router-view />
    <Toast position="top-right" />
  </div>
</template>

<style>
/* Global styles are handled by Tailwind */
</style>
