<template>
  <Drawer 
    :visible="isLeftSidebarVisible" 
    :baseZIndex="40" 
    :autoZIndex="true" 
    :modal="false"
    class="!w-56"
  >
    <template #container>
      <div class="flex flex-col h-full justify-between font-poppins bg-surface-50 border-r">
        <div class="flex justify-between items-center p-1.5 border-b border-surface-200">
          <div>
            <img 
              src="@/assets/images/logo.svg" 
              class="object-contain h-8"
              alt="AktivTracker Logo" 
            />
          </div>
          <SidebarMenuToggle />
        </div>

        <div class="flex flex-1 flex-col gap-0 overflow-auto mb-4">
          <div v-if="sideBarMenu.navMain.length" class="relative flex w-full min-w-0 flex-col pl-2">
            <div class="duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-none ease-linear">
              {{ sideBarMenu.navMain[0].title }}
            </div>
            <ul class="pl-2 list-none p-0 m-0">
              <li 
                v-for="(moduleItem, idx) in sideBarMenu.navMain[0].items" 
                :key="moduleItem.id || idx" 
                class="relative flex w-full min-w-0 flex-col"
              >
                <div class="text-sm">
                  <template v-if="moduleItem?.subModules?.length > 0">
                      <a
                        v-ripple
                        v-styleclass="{
                          selector: `#main-sub-menu-${moduleItem.id || idx}`,
                          enterFromClass: 'hidden',
                          enterActiveClass: 'animate-slidedown',
                          leaveToClass: 'hidden',
                          leaveActiveClass: 'animate-slideup'
                        }"
                        class="flex items-center cursor-pointer px-4 py-2 rounded text-foreground hover:bg-primary-600 hover:text-white duration-150 transition-colors p-ripple"
                      >
                      <i :class="moduleItem.icon || 'pi pi-box'" class="mr-2" style="font-size: 0.8rem"></i>
                      <span class="font-medium">{{ moduleItem.displayName || moduleItem.label }}</span>
                      <i class="pi pi-chevron-down ml-auto" style="font-size: 0.6rem"></i>
                    </a>
                    <ul
                      :id="`main-sub-menu-${moduleItem.id || idx}`"
                      class="list-none py-0 px-4 pr-0 m-0 hidden overflow-y-hidden transition-all duration-[400ms] ease-in-out"
                    >
                    <li 
                      v-for="(subModule, subIdx) in moduleItem.subModules" 
                      :key="subIdx" 
                      class="border-l border-primary-700"
                    >
                        <RouterLink 
                          v-ripple 
                          class="flex items-center cursor-pointer px-4 py-1.5 rounded text-foreground hover:bg-primary-600 hover:text-white duration-150 transition-colors p-ripple hover:border-l border-primary-700"
                          activeClass="bg-primary-700 text-white font-medium pr-2 border-l-2 border-primary-800"
                          :to="subModule.route || `/${subModule.code}`"
                        >
                          <i :class="subModule.icon || 'pi pi-circle'" class="mr-2" style="font-size: 0.8rem"></i>
                          <span>{{ subModule.label || subModule.name }}</span>
                        </RouterLink>
                      </li>
                    </ul>
                  </template>

                  <template v-else>
                    <RouterLink 
                      v-ripple 
                      class="flex items-center cursor-pointer mr-4 px-4 py-1.5 rounded text-foreground hover:bg-primary-600 hover:text-white duration-150 transition-colors p-ripple"
                      :to="moduleItem.route || `/${moduleItem.code}`"
                      activeClass="bg-primary-700 text-white font-medium pr-2"
                    >
                      <i :class="moduleItem.icon || 'pi pi-box'" class="mr-2" style="font-size: 0.8rem"></i>
                      <span class="font-medium">{{ moduleItem.displayName || moduleItem.label }}</span>
                    </RouterLink>
                  </template>
                </div>
              </li>
            </ul>
          </div>

          <template v-if="sideBarMenu.navOther[0].items.length">
            <div 
              v-for="(item, index) in sideBarMenu.navOther" 
              :key="index" 
              class="relative flex w-full min-w-0 flex-col pl-2"
            >
              <div class="duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-none ease-linear">
                {{ item.title }}
              </div>
              <ul v-for="subItem in item.items" :key="subItem.id" class="text-sm">
                <li v-if="subItem?.subModules?.length > 0">
                  <a
                    v-ripple
                    v-styleclass="{
                      selector: `#other-sub-menu-${subItem.id || index}`,
                      enterFromClass: 'hidden',
                      enterActiveClass: 'animate-slidedown',
                      leaveToClass: 'hidden',
                      leaveActiveClass: 'animate-slideup'
                    }"
                    class="flex items-center cursor-pointer px-4 py-2 rounded text-foreground hover:bg-primary-600 hover:text-white duration-150 transition-colors p-ripple"
                  >
                    <i :class="subItem.icon || 'pi pi-box'" class="mr-2" style="font-size: 0.8rem"></i>
                    <span class="font-medium">{{ subItem.displayName || subItem.label }}</span>
                    <i class="pi pi-chevron-down ml-auto" style="font-size: 0.6rem"></i>
                  </a>
                  <ul
                    :id="`other-sub-menu-${subItem.id || index}`"
                    class="list-none py-0 px-4 pr-0 m-0 hidden overflow-y-hidden transition-all duration-[400ms] ease-in-out"
                  >
                    <li 
                      v-for="(subModule, idx) in subItem.subModules" 
                      :key="idx" 
                      class="border-l border-primary-700"
                    >
                      <RouterLink 
                        v-ripple 
                        class="flex items-center cursor-pointer px-4 py-1.5 rounded text-foreground hover:bg-primary-600 hover:text-white duration-150 transition-colors p-ripple hover:border-l border-primary-700"
                        activeClass="bg-primary-700 text-white font-medium pr-2 border-l-2 border-primary-800"
                        :to="subModule.route || `/${subModule.code}`"
                      >
                        <i :class="subModule.icon || 'pi pi-circle'" class="mr-2" style="font-size: 0.8rem"></i>
                        <span>{{ subModule.label || subModule.name }}</span>
                      </RouterLink>
                    </li>
                  </ul>
                </li>

                <RouterLink 
                  v-else 
                  v-ripple 
                  class="flex items-center cursor-pointer mr-4 px-4 py-1.5 rounded text-foreground hover:bg-primary-600 hover:text-white duration-150 transition-colors p-ripple"
                  :to="subItem.route || `/${subItem.code}`"
                  activeClass="bg-primary-700 text-white font-medium"
                >
                  <i :class="subItem.icon || 'pi pi-box'" class="mr-2" style="font-size: 0.8rem"></i>
                  <span class="font-medium">{{ subItem.displayName || subItem.label }}</span>
                </RouterLink>
              </ul>
            </div>
          </template>
        </div>
      </div>
    </template>
  </Drawer>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Drawer } from 'primevue'
import SidebarMenuToggle from '@/components/buttons/SidebarMenuToggle.vue'
import { useLeftSidebarStore } from '@/stores/leftSidebar.js'

const leftSidebarVisible = useLeftSidebarStore()
const { isLeftSidebarVisible } = storeToRefs(leftSidebarVisible)

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', route: '/dashboard', icon: 'pi pi-home' },
  { id: 'jobs', label: 'Job Applications', route: '/jobs', icon: 'pi pi-briefcase' },
  { id: 'scholarships', label: 'Scholarships', route: '/scholarships', icon: 'pi pi-graduation-cap' },
  { id: 'activities', label: 'Activities', route: '/activities', icon: 'pi pi-calendar' },
  { id: 'opportunities', label: 'Opportunities', route: '/opportunities', icon: 'pi pi-star' },
  { id: 'documents', label: 'Documents', route: '/documents', icon: 'pi pi-file' },
  { id: 'analytics', label: 'Analytics', route: '/analytics', icon: 'pi pi-chart-bar' }
]

const othersItems = [
  { id: 'profile', label: 'Profile', route: '/profile', icon: 'pi pi-user' },
  { id: 'settings', label: 'Settings', route: '/settings', icon: 'pi pi-cog' }
]

const sideBarMenu = computed(() => ({
  navMain: [
    {
      title: 'MENU',
      items: menuItems
    }
  ],
  navOther: [
    {
      title: 'OTHERS',
      items: othersItems
    }
  ]
}))
</script>
