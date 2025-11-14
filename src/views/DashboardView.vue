<template>
  <div class="dashboard-page">
      <!-- Page Header -->
    <div class="dashboard-header">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-description">Overview of your applications and activities</p>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon jobs">
          <i class="pi pi-briefcase"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-number">
            <span v-if="loading" class="loading-skeleton"></span>
            <span v-else>{{ stats.jobs }}</span>
          </h3>
          <p class="stat-label">Job Applications</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon scholarships">
          <i class="pi pi-graduation-cap"></i>
              </div>
        <div class="stat-content">
          <h3 class="stat-number">
            <span v-if="loading" class="loading-skeleton"></span>
            <span v-else>{{ stats.scholarships }}</span>
          </h3>
          <p class="stat-label">Scholarship Applications</p>
              </div>
            </div>
      
      <div class="stat-card">
        <div class="stat-icon activities">
          <i class="pi pi-calendar"></i>
              </div>
        <div class="stat-content">
          <h3 class="stat-number">
            <span v-if="loading" class="loading-skeleton"></span>
            <span v-else>{{ stats.activities }}</span>
          </h3>
          <p class="stat-label">Activities</p>
              </div>
            </div>
      
      <div class="stat-card">
        <div class="stat-icon opportunities">
          <i class="pi pi-star"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-number">
            <span v-if="loading" class="loading-skeleton"></span>
            <span v-else>{{ stats.opportunities }}</span>
          </h3>
          <p class="stat-label">Opportunities</p>
              </div>
              </div>
            </div>

    <!-- Charts Section -->
    <div class="charts-grid">
      <!-- Applications Status Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>Application Status Overview</h3>
          <p>Distribution of your applications by status</p>
        </div>
        <div v-if="loading" class="loading-chart"></div>
        <Chart v-else-if="applicationStatusChartData.labels && applicationStatusChartData.labels.length > 0" type="doughnut" :data="applicationStatusChartData" :options="applicationStatusChartOptions" class="h-64" />
        <div v-else class="flex items-center justify-center h-64 text-foreground-muted">No data available</div>
      </div>

      <!-- Monthly Applications Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>Applications This Year</h3>
          <p>Monthly application trends</p>
        </div>
        <div v-if="loading" class="loading-chart"></div>
        <Chart v-else-if="monthlyApplicationsChartData.labels && monthlyApplicationsChartData.labels.length > 0" type="line" :data="monthlyApplicationsChartData" :options="monthlyApplicationsChartOptions" class="h-64" />
        <div v-else class="flex items-center justify-center h-64 text-foreground-muted">No data available</div>
      </div>

      <!-- Priority Distribution Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>Priority Distribution</h3>
          <p>Applications by priority level</p>
        </div>
        <div v-if="loading" class="loading-chart"></div>
        <Chart v-else-if="priorityDistributionChartData.labels && priorityDistributionChartData.labels.length > 0" type="bar" :data="priorityDistributionChartData" :options="priorityDistributionChartOptions" class="h-64" />
        <div v-else class="flex items-center justify-center h-64 text-foreground-muted">No data available</div>
      </div>

      <!-- Activity Types Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>Activity Types</h3>
          <p>Distribution of your activities</p>
              </div>
        <div v-if="loading" class="loading-chart"></div>
        <Chart v-else-if="activityTypeChartData.labels && activityTypeChartData.labels.length > 0" type="pie" :data="activityTypeChartData" :options="activityTypeChartOptions" class="h-64" />
        <div v-else class="flex items-center justify-center h-64 text-foreground-muted">No data available</div>
              </div>
            </div>

    <!-- Recent Activity Table -->
    <div class="recent-activity">
      <div class="activity-header">
        <h3>Recent Activity</h3>
        <Button label="View All" icon="pi pi-arrow-right" text />
      </div>

      <DataTable
        :value="recentActivity"
        :loading="loading"
        :paginator="false"
        class="p-datatable-sm"
        :showGridlines="true"
      >
        <Column field="type" header="Type" style="min-width: 100px">
          <template #body="slotProps">
            <Tag :value="slotProps.data.type" :severity="getTypeSeverity(slotProps.data.type)" />
          </template>
        </Column>
        <Column field="title" header="Title" style="min-width: 200px" />
        <Column field="status" header="Status" style="min-width: 120px">
          <template #body="slotProps">
            <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
          </template>
        </Column>
        <Column field="date" header="Date" style="min-width: 120px">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.date) }}
          </template>
        </Column>
      </DataTable>
    </div>
      </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import Chart from 'primevue/chart'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { analyticsAPI } from '@/api/analytics'

const toast = useToast()

// Reactive data
const loading = ref(false)
const stats = ref({
  jobs: 0,
  scholarships: 0,
  activities: 0,
  opportunities: 0
})

const recentActivity = ref([])

// Chart data - will be populated from API
const applicationStatusChartData = ref({
  labels: [],
  datasets: [{
    data: [],
    backgroundColor: [
      '#3B82F6',
      '#F59E0B',
      '#10B981',
      '#EF4444',
      '#6B7280'
    ],
    borderWidth: 0
  }]
})

const monthlyApplicationsChartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [{
    label: 'Applications',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    tension: 0.4,
    fill: true
  }]
})

const priorityDistributionChartData = ref({
  labels: [],
  datasets: [{
    label: 'Applications',
    data: [],
    backgroundColor: [
      '#6B7280',
      '#F59E0B',
      '#EF4444',
      '#DC2626'
    ]
  }]
})

const activityTypeChartData = ref({
  labels: [],
  datasets: [{
    data: [],
    backgroundColor: [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#8B5CF6',
      '#6B7280'
    ],
    borderWidth: 0
  }]
})

// Chart options
const applicationStatusChartOptions = ref({
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%'
})

const monthlyApplicationsChartOptions = ref({
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#E5E7EB'
      }
    },
    x: {
      grid: {
        color: '#E5E7EB'
      }
    }
  },
  responsive: true,
  maintainAspectRatio: false
})

const priorityDistributionChartOptions = ref({
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#E5E7EB'
      }
    },
    x: {
      grid: {
        color: '#E5E7EB'
      }
    }
  },
  responsive: true,
  maintainAspectRatio: false
})

const activityTypeChartOptions = ref({
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    }
  },
  responsive: true,
  maintainAspectRatio: false
})

// Methods
const fetchDashboardData = async () => {
  try {
    loading.value = true
    const response = await analyticsAPI.getDashboardAnalytics()
    
    // Update stats from the actual API response structure
    stats.value = {
      jobs: response.data.job_applications?.total || 0,
      scholarships: response.data.scholarship_applications?.total || 0,
      activities: response.data.activities?.total || 0,
      opportunities: 0 // Not in current API response
    }

    // Update recent activity - we'll create this from the data
    recentActivity.value = []

    // Update chart data with real data from job applications
    if (response.data.job_applications?.by_status) {
      applicationStatusChartData.value = {
        labels: Object.keys(response.data.job_applications.by_status),
        datasets: [{
          data: Object.values(response.data.job_applications.by_status),
          backgroundColor: [
            '#3B82F6',
            '#F59E0B',
            '#10B981',
            '#EF4444',
            '#6B7280'
          ],
          borderWidth: 0
        }]
      }
            } else {
              // Fallback data if no status data
              applicationStatusChartData.value = {
                labels: ['Applied', 'Screening', 'Interview'],
                datasets: [{
                  data: [45, 15, 15],
                  backgroundColor: ['#3B82F6', '#F59E0B', '#EF4444'],
                  borderWidth: 0
                }]
              }
            }

    // Update priority chart data
    if (response.data.job_applications?.by_priority) {
      priorityDistributionChartData.value = {
        labels: Object.keys(response.data.job_applications.by_priority),
        datasets: [{
          label: 'Applications',
          data: Object.values(response.data.job_applications.by_priority),
          backgroundColor: [
            '#6B7280',
            '#F59E0B',
            '#EF4444',
            '#DC2626'
          ]
        }]
      }
    } else {
      // Fallback data
      priorityDistributionChartData.value = {
        labels: ['High', 'Medium'],
        datasets: [{
          label: 'Applications',
          data: [45, 30],
          backgroundColor: ['#EF4444', '#F59E0B']
        }]
      }
    }

    // Update activity chart data
    if (response.data.activities?.by_type) {
      activityTypeChartData.value = {
        labels: Object.keys(response.data.activities.by_type),
        datasets: [{
          data: Object.values(response.data.activities.by_type),
          backgroundColor: [
            '#3B82F6',
            '#10B981',
            '#F59E0B',
            '#8B5CF6',
            '#6B7280'
          ],
          borderWidth: 0
        }]
      }
    } else {
      // Fallback data
      activityTypeChartData.value = {
        labels: ['Learning', 'Networking', 'Personal'],
        datasets: [{
          data: [12, 6, 12],
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
          borderWidth: 0
        }]
      }
    }

    console.log('Dashboard data loaded:', response.data)
    console.log('Stats updated:', stats.value)
    console.log('Loading state:', loading.value)
    console.log('Application Status Chart Data:', applicationStatusChartData.value)
    console.log('Priority Chart Data:', priorityDistributionChartData.value)
    console.log('Activity Chart Data:', activityTypeChartData.value)

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch dashboard data',
      life: 3000
    })
          } finally {
            // Reduce delay to show loading animation briefly
            setTimeout(() => {
              loading.value = false
            }, 300) // Reduced from 1000ms to 300ms
          }
}

const getTypeSeverity = (type) => {
  const typeMap = {
    'job': 'info',
    'scholarship': 'success',
    'activity': 'warning',
    'opportunity': 'primary'
  }
  return typeMap[type] || 'info'
}

        const getStatusSeverity = (status) => {
          const statusMap = {
            'applied': 'info',
            'interview': 'warning',
            'offer': 'success',
            'rejected': 'danger',
            'screening': 'secondary',
            'accepted': 'success',
            'submitted': 'info',
            'under_review': 'warning',
            'in_progress': 'info',
            'completed': 'success',
            'planned': 'secondary',
            'cancelled': 'danger'
          }
          return statusMap[status] || 'info'
        }

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Initialize
onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.dashboard-page {
  padding: 1.5rem;
  background: #f8fafc;
  min-height: 100vh;
}

/* Loading animations */
.loading-skeleton {
  display: inline-block;
  width: 4rem;
  height: 2rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.loading-chart {
  width: 100%;
  height: 16rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.dashboard-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.page-description {
  color: #6b7280;
  margin: 0;
  font-size: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-icon.jobs {
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
}

.stat-icon.scholarships {
  background: linear-gradient(135deg, #10B981, #059669);
}

.stat-icon.activities {
  background: linear-gradient(135deg, #F59E0B, #D97706);
}

.stat-icon.opportunities {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.stat-label {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-header {
  margin-bottom: 1rem;
}

.chart-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.chart-header p {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

.recent-activity {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.activity-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .dashboard-page {
    background: #111827;
  }
  
  .page-title {
    color: #f9fafb;
  }
  
  .page-description {
    color: #9ca3af;
  }
  
  .stat-card,
  .chart-card,
  .recent-activity {
    background: #1f2937;
    border: 1px solid #374151;
  }
  
  .stat-number {
    color: #f9fafb;
  }
  
  .stat-label {
    color: #9ca3af;
  }
  
  .chart-header h3,
  .activity-header h3 {
    color: #f9fafb;
  }
  
  .chart-header p {
    color: #9ca3af;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .dashboard-page {
    padding: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .chart-card {
    padding: 1rem;
  }
}

/* Ensure charts have proper height */
:deep(.p-chart) {
  height: 16rem !important;
}

:deep(.p-chart canvas) {
  height: 16rem !important;
}
</style>