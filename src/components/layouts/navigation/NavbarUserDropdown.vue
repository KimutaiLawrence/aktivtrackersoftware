<template>
  <div>
    <div class="flex items-center gap-2">
      <slot name="trigger" :toggle="toggle">
        <Button 
          type="button" 
          @click="toggle" 
          aria-haspopup="true" 
          aria-controls="overlay_menu"
          class="bg-transparent p-0 !border-surface-300 hover:!bg-gray-100 shadow-sm rounded-full hover:shadow-md hover:!border-surface-500 h-10 w-10 flex items-center justify-center"
        >
          <div class="inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-primary-500 rounded-full">
            <span class="font-medium text-white uppercase text-sm">{{ userInitials }}</span>
          </div>
        </Button>
      </slot>
    </div>

    <Menu 
      ref="menu" 
      id="overlay_menu" 
      :model="items" 
      :popup="true" 
      class="w-60 text-sm"
    >
      <template #start>
        <div 
          v-ripple
          class="relative overflow-hidden w-full border bg-transparent flex gap-2 items-center p-1.5 hover:bg-surface-100 rounded-none transition-colors duration-200"
        >
          <div class="inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-primary-500 rounded-full">
            <span class="font-medium text-white uppercase">{{ userInitials }}</span>
          </div>
          <span class="inline-flex flex-col items-start">
            <span class="font-semibold text-primary">{{ userFirstName }} {{ userLastName }}</span>
            <span class="bg-violet-100 text-violet-800 text-xs font-medium px-1 py-0.5 rounded-sm">{{ userRole }}</span>
          </span>
        </div>
      </template>
      <template #item="{ item, props }">
        <a v-ripple class="flex items-center" v-bind="props.action">
          <span :class="item.icon" />
          <span>{{ item.label }}</span>
          <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
          <span 
            v-if="item.shortcut"
            class="ml-auto rounded bg-emphasis text-muted-color text-xs p-1"
          >
            {{ item.shortcut }}
          </span>
        </a>
      </template>
    </Menu>

    <ConfirmDialog class="!backdrop-blur-lg" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Menu, Button, Badge, useConfirm, ConfirmDialog } from 'primevue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const { user } = storeToRefs(authStore)
const confirm = useConfirm()

const userFirstName = computed(() => user.value?.full_name?.split(' ')[0] || user.value?.username || 'User')
const userLastName = computed(() => {
  const nameParts = user.value?.full_name?.split(' ') || []
  return nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''
})
const userInitials = computed(() => {
  const first = userFirstName.value.charAt(0).toUpperCase()
  const last = userLastName.value.charAt(0).toUpperCase()
  return first + last
})
const userRole = computed(() => user.value?.role || 'User')

const menu = ref()
const items = ref([
  {
    label: 'Profile',
    icon: 'pi pi-user',
    command: () => {
      router.push('/profile')
    }
  },
  {
    separator: true
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => {
      logOut()
    }
  }
])

const toggle = (event) => {
  menu.value.toggle(event)
}

const logOut = () => {
  confirm.require({
    message: 'Are you sure you want to log out of your account?',
    header: 'Log Out',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      severity: 'danger'
    },
    accept: async () => {
      await authStore.logout()
      router.push('/login')
    },
    reject: () => {
    }
  })
}
</script>

