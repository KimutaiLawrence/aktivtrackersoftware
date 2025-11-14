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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { Button, InputSwitch, Toast } from 'primevue'

const router = useRouter()
const toast = useToast()

const settings = ref({
  darkMode: false,
  emailNotifications: true
})
</script>

