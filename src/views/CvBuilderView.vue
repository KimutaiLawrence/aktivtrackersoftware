<template>
  <div class="flex flex-col items-center justify-center gap-4 py-24 text-center">
    <template v-if="!error">
      <i class="pi pi-spin pi-spinner text-3xl text-primary-500"></i>
      <p class="text-foreground">
        Signing you in to RevampYourCV{{ route.query.job ? ' to tailor your CV for this job' : '' }}…
      </p>
    </template>
    <template v-else>
      <i class="pi pi-exclamation-triangle text-3xl text-red-500"></i>
      <p class="text-foreground">{{ error }}</p>
      <Button label="Try again" icon="pi pi-refresh" size="small" @click="go" />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from 'primevue'
import { integrationsAPI } from '@/api/integrations'

const route = useRoute()
const error = ref('')

const go = async () => {
  error.value = ''
  try {
    const { data } = await integrationsAPI.revampYourCvHandoff(route.query.job || null)
    window.location.replace(data.url)
  } catch (e) {
    error.value = e.response?.data?.detail || 'Could not open RevampYourCV. Please try again.'
  }
}

onMounted(go)
</script>
