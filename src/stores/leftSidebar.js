import { defineStore } from 'pinia'

export const useLeftSidebarStore = defineStore('leftSidebar', {
  state: () => ({
    isLeftSidebarVisible: true,
  }),
  actions: {
    toggleLeftSidebar() {
      this.isLeftSidebarVisible = !this.isLeftSidebarVisible
    }
  }
})

