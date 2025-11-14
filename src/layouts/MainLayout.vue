<template>
  <Navbar />

  <KeepAlive>
    <Sidebar />
  </KeepAlive>

  <section 
    id="body" 
    class="px-1.5 mt-16 bg-surface-100"
    :class="{ 'md:ml-56': isLeftSidebarVisible }"
  >
    <RouterView />
  </section>
</template>

<script setup>
import { useLeftSidebarStore } from '@/stores/leftSidebar'
import Sidebar from '@/components/layouts/navigation/Sidebar.vue'
import Navbar from '@/components/layouts/navigation/Navbar.vue'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterView } from 'vue-router'

const leftSidebarVisible = useLeftSidebarStore()
const { isLeftSidebarVisible } = storeToRefs(leftSidebarVisible)

function handleResize() {
  isLeftSidebarVisible.value = window.innerWidth > 768
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})
</script>
