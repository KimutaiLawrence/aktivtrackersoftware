<template>
  <MainLayout>
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <template #content>
            <div class="flex flex-col items-center space-y-4">
              <Avatar
                :image="authStore.user?.profile_picture_url"
                :label="authStore.user?.full_name?.charAt(0)"
                size="xlarge"
                shape="circle"
                class="bg-primary-500 text-white"
              />
              <div class="text-center">
                <h3 class="text-xl font-semibold">{{ authStore.user?.full_name || authStore.user?.username }}</h3>
                <p class="text-gray-600">{{ authStore.user?.email }}</p>
                <Tag :value="authStore.user?.role" class="mt-2" />
              </div>
              <Button label="Upload Photo" icon="pi pi-upload" outlined class="w-full" />
            </div>
          </template>
        </Card>

        <Card class="lg:col-span-2">
          <template #content>
            <div class="space-y-4">
              <h3 class="text-lg font-semibold mb-4">Personal Information</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                  <label class="font-medium">Full Name</label>
                  <InputText v-model="profileData.full_name" />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-medium">Username</label>
                  <InputText v-model="profileData.username" />
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-medium">Email</label>
                <InputText v-model="profileData.email" disabled />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-medium">Phone</label>
                <InputText v-model="profileData.phone" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-medium">Bio</label>
                <Textarea v-model="profileData.bio" rows="4" />
              </div>

              <div class="flex justify-end gap-2">
                <Button label="Cancel" outlined />
                <Button label="Save Changes" @click="saveProfile" />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <Card>
        <template #header>
          <div class="p-4 border-b">
            <h3 class="text-lg font-semibold">Change Password</h3>
          </div>
        </template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex flex-col gap-2">
              <label class="font-medium">Current Password</label>
              <Password v-model="passwordData.current" :feedback="false" toggleMask />
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-medium">New Password</label>
              <Password v-model="passwordData.new" toggleMask />
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-medium">Confirm Password</label>
              <Password v-model="passwordData.confirm" :feedback="false" toggleMask />
            </div>
          </div>
          <div class="mt-4">
            <Button label="Change Password" @click="changePassword" />
          </div>
        </template>
      </Card>
    </div>
  </MainLayout>
</template>

<script setup>
import { reactive } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '../stores/auth'
import MainLayout from '../layouts/MainLayout.vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Password from 'primevue/password'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'

const toast = useToast()
const authStore = useAuthStore()

const profileData = reactive({
  full_name: authStore.user?.full_name || '',
  username: authStore.user?.username || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
  bio: authStore.user?.bio || ''
})

const passwordData = reactive({
  current: '',
  new: '',
  confirm: ''
})

const saveProfile = () => {
  toast.add({ severity: 'success', summary: 'Success', detail: 'Profile updated', life: 3000 })
}

const changePassword = async () => {
  if (passwordData.new !== passwordData.confirm) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Passwords do not match', life: 3000 })
    return
  }
  try {
    await authStore.changePassword({
      current_password: passwordData.current,
      new_password: passwordData.new
    })
    toast.add({ severity: 'success', summary: 'Success', detail: 'Password changed', life: 3000 })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to change password', life: 3000 })
  }
}
</script>
