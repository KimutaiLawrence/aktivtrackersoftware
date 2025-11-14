<template>
  <button 
    @click="leftSidebarVisible.toggleLeftSidebar()"
    type="button" 
    class="rounded-lg p-2 inline-flex items-center justify-center h-10 w-10 hover:bg-surface-100 transition-colors"
    v-ripple
  >
    <SidebarHamburgerIcon />
  </button>
</template>

<script setup>
import SidebarHamburgerIcon from '@/components/icons/SidebarHamburgerIcon.vue'
import { useLeftSidebarStore } from '@/stores/leftSidebar.js'

const leftSidebarVisible = useLeftSidebarStore()
</script>

