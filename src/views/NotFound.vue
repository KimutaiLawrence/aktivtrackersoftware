<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary-600">404</h1>
      <h2 class="text-3xl font-semibold text-gray-900 dark:text-white mt-4">Page Not Found</h2>
      <p class="text-gray-600 dark:text-gray-400 mt-2 mb-8">The page you're looking for doesn't exist.</p>
      <Button label="Go to Dashboard" icon="pi pi-home" @click="$router.push('/dashboard')" />
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
</script>
