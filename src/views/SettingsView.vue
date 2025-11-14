<template>
  <div class="rounded-md bg-white shadow-sm px-2 pb-0.5 border border-gray-50 mb-2">
    <h1 class="text-base font-semibold text-primary-500 capitalize">Settings</h1>
    <p class="text-sm font-extralight leading-tight">Application settings and preferences</p>
  </div>

  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-50">
    <div class="space-y-6">
      <div>
        <h3 class="text-lg font-semibold text-foreground mb-4">General Settings</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-foreground">Dark Mode</label>
              <p class="text-xs text-foreground-muted">Toggle dark mode theme</p>
            </div>
            <InputSwitch v-model="settings.darkMode" />
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-foreground">Email Notifications</label>
              <p class="text-xs text-foreground-muted">Receive email notifications</p>
            </div>
            <InputSwitch v-model="settings.emailNotifications" />
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-foreground mb-4">Typography</h3>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-foreground mb-2 block">Font Family</label>
            <p class="text-xs text-foreground-muted mb-3">Choose your preferred font family</p>
            <Dropdown 
              v-model="selectedFont" 
              :options="fontOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Select font"
              class="w-full"
              @change="onFontChange"
              :loading="preferencesStore.loading"
            />
            <p class="text-xs text-foreground-muted mt-2">
              Current: {{ fontOptions.find(f => f.value === selectedFont)?.label || 'Geist' }}
              {{ selectedFont === 'geist' ? '(with SF Pro fallback)' : selectedFont === 'sf-pro' ? '(with system fallback)' : '(system default)' }}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-foreground mb-4">Account Settings</h3>
        <div class="space-y-4">
          <Button label="Change Password" icon="pi pi-key" outlined @click="router.push('/profile')" />
          <Button label="Delete Account" icon="pi pi-trash" severity="danger" outlined />
        </div>
      </div>
    </div>
  </div>

  <Toast />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { Button, InputSwitch, Toast, Dropdown } from 'primevue'
import { usePreferencesStore } from '@/stores/preferences'

const router = useRouter()
const toast = useToast()
const preferencesStore = usePreferencesStore()

const settings = ref({
  darkMode: false,
  emailNotifications: true
})

const fontOptions = [
  { label: 'Geist (with SF Pro fallback)', value: 'geist' },
  { label: 'SF Pro (with system fallback)', value: 'sf-pro' },
  { label: 'System Default', value: 'system' }
]

const selectedFont = ref('geist')

onMounted(async () => {
  await preferencesStore.loadPreferences()
  selectedFont.value = preferencesStore.fontFamily
})

const onFontChange = async () => {
  try {
    await preferencesStore.updateFontFamily(selectedFont.value)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Font preference updated successfully',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update font preference',
      life: 3000
    })
  }
}
</script>

