<template>
  <MainLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Welcome back, {{ authStore.user?.full_name || authStore.user?.username }}!</p>
        </div>
        <Button label="Quick Add" icon="pi pi-plus" @click="quickAddVisible = true" />
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card class="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-smooth">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Job Applications</p>
                <h3 class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ stats.jobs || 0 }}</h3>
                <p class="text-green-600 text-sm mt-1">
                  <i class="pi pi-arrow-up"></i> {{ stats.jobsActive || 0 }} active
                </p>
              </div>
              <div class="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <i class="pi pi-briefcase text-2xl text-blue-600 dark:text-blue-400"></i>
              </div>
            </div>
          </template>
        </Card>

        <Card class="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-smooth">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Scholarships</p>
                <h3 class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ stats.scholarships || 0 }}</h3>
                <p class="text-green-600 text-sm mt-1">
                  <i class="pi pi-arrow-up"></i> {{ stats.scholarshipsActive || 0 }} active
                </p>
              </div>
              <div class="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <i class="pi pi-book text-2xl text-purple-600 dark:text-purple-400"></i>
              </div>
            </div>
          </template>
        </Card>

        <Card class="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-smooth">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Activities</p>
                <h3 class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ stats.activities || 0 }}</h3>
                <p class="text-orange-600 text-sm mt-1">
                  <i class="pi pi-clock"></i> {{ stats.activitiesPending || 0 }} pending
                </p>
              </div>
              <div class="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
                <i class="pi pi-calendar text-2xl text-orange-600 dark:text-orange-400"></i>
              </div>
            </div>
          </template>
        </Card>

        <Card class="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-smooth">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Documents</p>
                <h3 class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ stats.documents || 0 }}</h3>
                <p class="text-gray-600 text-sm mt-1">
                  <i class="pi pi-file"></i> Total files
                </p>
              </div>
              <div class="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <i class="pi pi-file text-2xl text-green-600 dark:text-green-400"></i>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Application Status Chart -->
        <Card>
          <template #header>
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Application Status</h3>
            </div>
          </template>
          <template #content>
            <Chart type="doughnut" :data="statusChartData" :options="chartOptions" class="w-full h-64" />
          </template>
        </Card>

        <!-- Recent Activity Timeline -->
        <Card>
          <template #header>
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            </div>
          </template>
          <template #content>
            <Timeline :value="recentActivities" class="w-full">
              <template #content="slotProps">
                <div class="flex items-start space-x-3">
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ slotProps.item.title }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ slotProps.item.description }}</p>
                  </div>
                  <span class="text-xs text-gray-400">{{ slotProps.item.time }}</span>
                </div>
              </template>
              <template #marker="slotProps">
                <span class="flex items-center justify-center w-8 h-8 rounded-full" :class="slotProps.item.color">
                  <i :class="slotProps.item.icon" class="text-white"></i>
                </span>
              </template>
            </Timeline>
          </template>
        </Card>
      </div>

      <!-- Quick Actions -->
      <Card>
        <template #header>
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
          </div>
        </template>
        <template #content>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button label="Add Job" icon="pi pi-briefcase" outlined @click="router.push('/jobs')" class="w-full" />
            <Button label="Add Scholarship" icon="pi pi-book" outlined @click="router.push('/scholarships')" class="w-full" />
            <Button label="Add Activity" icon="pi pi-calendar" outlined @click="router.push('/activities')" class="w-full" />
            <Button label="Upload Document" icon="pi pi-upload" outlined @click="router.push('/documents')" class="w-full" />
          </div>
        </template>
      </Card>
    </div>

    <!-- Quick Add Dialog -->
    <Dialog v-model:visible="quickAddVisible" header="Quick Add" :modal="true" :style="{ width: '30rem' }">
      <div class="space-y-3">
        <Button label="Job Application" icon="pi pi-briefcase" outlined class="w-full" @click="handleQuickAdd('job')" />
        <Button label="Scholarship" icon="pi pi-book" outlined class="w-full" @click="handleQuickAdd('scholarship')" />
        <Button label="Activity" icon="pi pi-calendar" outlined class="w-full" @click="handleQuickAdd('activity')" />
        <Button label="Document" icon="pi pi-file" outlined class="w-full" @click="handleQuickAdd('document')" />
      </div>
    </Dialog>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { analyticsAPI } from '../api'
import MainLayout from '../layouts/MainLayout.vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Chart from 'primevue/chart'
import Timeline from 'primevue/timeline'
import Dialog from 'primevue/dialog'

const router = useRouter()
const authStore = useAuthStore()

const quickAddVisible = ref(false)
const stats = ref({
  jobs: 0,
  jobsActive: 0,
  scholarships: 0,
  scholarshipsActive: 0,
  activities: 0,
  activitiesPending: 0,
  documents: 0
})

const statusChartData = ref({
  labels: ['Applied', 'Interview', 'Offer', 'Rejected'],
  datasets: [{
    data: [12, 5, 3, 8],
    backgroundColor: ['#2563EB', '#10B981', '#F59E0B', '#EF4444'],
    hoverBackgroundColor: ['#1D4ED8', '#059669', '#D97706', '#DC2626']
  }]
})

const chartOptions = ref({
  plugins: {
    legend: {
      position: 'bottom'
    }
  },
  responsive: true,
  maintainAspectRatio: false
})

const recentActivities = ref([
  {
    title: 'Job Application Submitted',
    description: 'Applied to Software Engineer at Tech Corp',
    time: '2 hours ago',
    icon: 'pi pi-briefcase',
    color: 'bg-blue-500'
  },
  {
    title: 'Interview Scheduled',
    description: 'Interview with ABC Company on Friday',
    time: '5 hours ago',
    icon: 'pi pi-calendar',
    color: 'bg-green-500'
  },
  {
    title: 'Document Uploaded',
    description: 'Updated resume added to documents',
    time: '1 day ago',
    icon: 'pi pi-file',
    color: 'bg-purple-500'
  },
  {
    title: 'Scholarship Deadline',
    description: 'Graduate Scholarship deadline in 3 days',
    time: '2 days ago',
    icon: 'pi pi-exclamation-triangle',
    color: 'bg-orange-500'
  }
])

const handleQuickAdd = (type) => {
  quickAddVisible.value = false
  router.push(`/${type}s`)
}

const fetchDashboardStats = async () => {
  try {
    const response = await analyticsAPI.getDashboardAnalytics()
    if (response.data) {
      stats.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
  }
}

onMounted(() => {
  fetchDashboardStats()
})
</script>
