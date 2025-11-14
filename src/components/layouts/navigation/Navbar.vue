<template>
  <nav 
    class="flex justify-between items-center bg-white border-b border-gray-100 h-16 px-2 fixed top-0 z-30 right-0 md:left-56 transition-all duration-300"
    :class="{ '!left-0': !isLeftSidebarVisible }"
  >
    <div class="flex items-center gap-2 h-full">
      <div class="flex items-center h-full">
        <SidebarMenuToggle v-if="!isLeftSidebarVisible" />
      </div>

      <div class="flex justify-start items-center gap-2 px-2 py-1 divide-x divide-surface-300 border border-surface-200 rounded-md h-10">
        <img 
          src="@/assets/images/logo.svg" 
          class="object-scale-down h-7 rounded-md" 
          alt="AktivTracker Logo" 
        />
        <div class="flex flex-col items-start font-semibold font-nunito-sans ps-2">
          <span class="text-sm text-primary-500 leading-tight">AktivTracker</span>
          <span class="text-[9px] font-normal font-rubik leading-none bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-md">
            {{ userFirstName }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between flex-1 h-full">
      <div class="hidden md:flex justify-center h-full items-center">
        <Breadcrumb :model="links" class="!py-0 !pl-0.5">
          <template #item="{ item }">
            <RouterLink :to="item.route" class="cursor-pointer">
              <span class="text-sm">{{ item.title }}</span>
            </RouterLink>
          </template>
          <template #separator> | </template>
        </Breadcrumb>
      </div>
    </div>

    <div class="flex items-center h-full">
      <NavbarUserDropdown />
    </div>
  </nav>
</template>

<script setup>
import { Breadcrumb } from 'primevue'
import { useLeftSidebarStore } from '@/stores/leftSidebar'
import SidebarMenuToggle from '@/components/buttons/SidebarMenuToggle.vue'
import NavbarUserDropdown from '@/components/layouts/navigation/NavbarUserDropdown.vue'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const leftSidebarVisible = useLeftSidebarStore()
const { isLeftSidebarVisible } = storeToRefs(leftSidebarVisible)
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const route = useRoute()

const userFirstName = ref(user.value?.full_name?.split(' ')[0] || user.value?.username || 'User')

function setLinks() {
  const segments = route.fullPath.split('/').filter(item => item !== '')
  const breadcrumbs = segments.map((item, index) => {
    const str = item.replace(/-/g, ' ')
    const title = str
      .split(' ')
      .filter(word => !/[0-9]/.test(word))
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
    return {
      title,
      route: `/${segments.slice(0, index + 1).join('/')}`,
    }
  })
  return [...breadcrumbs]
}

const links = ref([])

watch(() => route.fullPath, (val) => {
  if (val) {
    links.value = setLinks()
  }
}, { immediate: true })
</script>
