<template>
  <nav 
    class="flex justify-between items-center bg-white border-b border-gray-100 h-16 px-2 fixed top-0 z-30 right-0 md:left-56 transition-all duration-300"
    :class="{ '!left-0': !isLeftSidebarVisible }"
  >
    <div class="flex items-center gap-2 h-full">
      <div class="flex items-center h-full">
        <SidebarMenuToggle v-if="!isLeftSidebarVisible" />
      </div>
    </div>

    <div class="flex items-center gap-3 h-full">
      <NavbarUserDropdown>
        <template #trigger="{ toggle }">
          <button 
            type="button"
            @click="toggle"
            class="flex items-center justify-between gap-3 px-3 py-2 h-10 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer min-w-[200px]"
          >
            <div class="flex items-center gap-2 flex-1 min-w-0 justify-end">
              <img 
                src="@/assets/images/logo.svg" 
                class="object-scale-down h-5 rounded-md flex-shrink-0" 
                alt="AktivTracker Logo" 
              />
              <div class="flex flex-col items-end font-semibold font-nunito-sans min-w-0 flex-1">
                <span class="text-xs text-primary-500 leading-tight truncate w-full text-right">AktivTracker</span>
                <div class="flex items-center gap-1.5 justify-end">
                  <span class="text-[10px] font-normal font-rubik leading-none text-gray-600">
                    {{ userFirstName }}
                  </span>
                  <span class="text-[9px] font-medium font-rubik leading-none bg-violet-100 text-violet-800 px-1.5 py-0.5 rounded-sm">
                    {{ userRole }}
                  </span>
                </div>
              </div>
            </div>
            <div class="inline-flex items-center justify-center w-9 h-9 bg-blue-600 rounded border border-blue-700 flex-shrink-0 shadow-sm">
              <span class="font-bold text-white uppercase text-sm leading-none">{{ userInitials }}</span>
            </div>
          </button>
        </template>
      </NavbarUserDropdown>

      <div v-if="isAdmin" class="flex items-center border border-gray-300 rounded-md px-2 py-1">
        <Dropdown 
          v-model="selectedRole" 
          :options="roleOptions" 
          optionLabel="label"
          optionValue="value"
          placeholder="Switch Role"
          class="!w-36 !h-8 !text-xs"
          @change="handleRoleSwitch"
        />
      </div>
    </div>
  </nav>
</template>

<script setup>
import { Dropdown } from 'primevue'
import { useLeftSidebarStore } from '@/stores/leftSidebar'
import SidebarMenuToggle from '@/components/buttons/SidebarMenuToggle.vue'
import NavbarUserDropdown from '@/components/layouts/navigation/NavbarUserDropdown.vue'
import { storeToRefs } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const leftSidebarVisible = useLeftSidebarStore()
const { isLeftSidebarVisible } = storeToRefs(leftSidebarVisible)
const authStore = useAuthStore()
const { user, isAdmin } = storeToRefs(authStore)

const userFirstName = computed(() => user.value?.full_name?.split(' ')[0] || user.value?.username || 'User')
const userRole = computed(() => user.value?.role || 'user')
const userInitials = computed(() => {
  const firstName = userFirstName.value
  const lastName = user.value?.full_name?.split(' ').slice(1).join(' ') || ''
  const first = firstName.charAt(0).toUpperCase()
  const last = lastName.charAt(0).toUpperCase() || firstName.charAt(0).toUpperCase()
  return first + last
})

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Premium User', value: 'premium_user' },
  { label: 'User', value: 'user' }
]

const selectedRole = ref(userRole.value)

const handleRoleSwitch = () => {
  if (selectedRole.value && selectedRole.value !== userRole.value) {
    localStorage.setItem('viewAsRole', selectedRole.value)
    window.location.reload()
  }
}

watch(() => user.value, () => {
  if (user.value) {
    const storedRole = localStorage.getItem('viewAsRole')
    selectedRole.value = storedRole || userRole.value
  }
}, { immediate: true })
</script>
