<template>
  <div class="min-h-screen flex bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <Sidebar
      v-model:visible="sidebarVisible"
      :header="false"
      :showCloseIcon="false"
      class="w-64"
      :pt="{
        root: { class: 'bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700' },
        content: { class: 'p-0' }
      }"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <router-link to="/dashboard" class="flex items-center space-x-2">
            <i class="pi pi-chart-line text-2xl text-primary-600"></i>
            <span class="text-xl font-bold text-gray-800 dark:text-white">AktivTracker</span>
          </router-link>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 overflow-y-auto p-4 scrollbar-thin">
          <ul class="space-y-1">
            <li v-for="item in menuItems" :key="item.label">
              <router-link
                :to="item.to"
                class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-smooth hover:bg-gray-100 dark:hover:bg-gray-700"
                :class="{
                  'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400': isActiveRoute(item.to),
                  'text-gray-700 dark:text-gray-300': !isActiveRoute(item.to)
                }"
              >
                <i :class="item.icon" class="text-lg"></i>
                <span class="font-medium">{{ item.label }}</span>
                <Badge
                  v-if="item.badge"
                  :value="item.badge"
                  severity="info"
                  class="ml-auto"
                />
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- User Profile Section -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-3 p-2">
            <Avatar
              :image="authStore.user?.profile_picture_url"
              :label="authStore.user?.full_name?.charAt(0) || authStore.user?.username?.charAt(0)"
              shape="circle"
              size="large"
              class="bg-primary-500 text-white"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ authStore.user?.full_name || authStore.user?.username }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ authStore.user?.email }}
              </p>
            </div>
            <Button
              icon="pi pi-sign-out"
              rounded
              text
              severity="danger"
              @click="handleLogout"
              v-tooltip.top="'Logout'"
            />
          </div>
        </div>
      </div>
    </Sidebar>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col">
      <!-- Top Navbar -->
      <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div class="flex items-center justify-between px-6 py-4">
          <!-- Mobile Menu Button & Title -->
          <div class="flex items-center space-x-4">
            <Button
              icon="pi pi-bars"
              rounded
              text
              @click="sidebarVisible = !sidebarVisible"
              class="lg:hidden"
            />
            <h1 class="text-xl font-semibold text-gray-800 dark:text-white">
              {{ currentPageTitle }}
            </h1>
          </div>

          <!-- Right Side Actions -->
          <div class="flex items-center space-x-3">
            <!-- Dark Mode Toggle -->
            <Button
              :icon="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
              rounded
              text
              @click="toggleDarkMode"
              v-tooltip.bottom="'Toggle Dark Mode'"
            />

            <!-- Notifications -->
            <Button
              icon="pi pi-bell"
              rounded
              text
              severity="secondary"
              @click="toggleNotifications"
              v-tooltip.bottom="'Notifications'"
            >
              <Badge v-if="notificationCount > 0" :value="notificationCount" severity="danger" />
            </Button>

            <!-- Profile Menu -->
            <Button
              icon="pi pi-user"
              rounded
              text
              @click="toggleProfileMenu"
              v-tooltip.bottom="'Profile'"
            />
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
        <router-view />
      </main>
    </div>

    <!-- Toast Notifications -->
    <Toast position="top-right" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Sidebar from 'primevue/sidebar'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Toast from 'primevue/toast'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const sidebarVisible = ref(true)
const isDarkMode = ref(false)
const notificationCount = ref(3)

const menuItems = ref([
  { label: 'Dashboard', to: '/dashboard', icon: 'pi pi-home' },
  { label: 'Job Applications', to: '/jobs', icon: 'pi pi-briefcase', badge: null },
  { label: 'Scholarships', to: '/scholarships', icon: 'pi pi-book' },
  { label: 'Activities', to: '/activities', icon: 'pi pi-calendar' },
  { label: 'Opportunities', to: '/opportunities', icon: 'pi pi-star' },
  { label: 'Documents', to: '/documents', icon: 'pi pi-file' },
  { label: 'Analytics', to: '/analytics', icon: 'pi pi-chart-bar' },
  { label: 'Profile', to: '/profile', icon: 'pi pi-user' },
])

const currentPageTitle = computed(() => {
  const item = menuItems.value.find(item => item.to === route.path)
  return item?.label || 'AktivTracker'
})

const isActiveRoute = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark-mode', isDarkMode.value)
  localStorage.setItem('darkMode', isDarkMode.value)
}

const toggleNotifications = () => {
  // TODO: Implement notifications panel
  console.log('Toggle notifications')
}

const toggleProfileMenu = () => {
  router.push('/profile')
}

const handleLogout = async () => {
  await authStore.logout()
}

onMounted(() => {
  // Initialize dark mode from localStorage
  const savedDarkMode = localStorage.getItem('darkMode') === 'true'
  if (savedDarkMode) {
    isDarkMode.value = true
    document.documentElement.classList.add('dark-mode')
  }

  // Initialize auth if needed
  authStore.initializeAuth()
})
</script>

<style scoped>
/* Ensure sidebar is hidden on mobile by default */
@media (max-width: 1024px) {
  .p-sidebar {
    position: fixed !important;
  }
}
</style>
