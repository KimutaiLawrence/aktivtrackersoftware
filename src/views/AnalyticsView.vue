<template>
  <div class="rounded-md bg-white shadow-sm px-2 pb-0.5 border border-gray-50 mb-2">
    <h1 class="text-base font-semibold text-primary-500 capitalize">Analytics</h1>
    <p class="text-sm font-extralight leading-tight">Analytics and insights</p>
  </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-50">
      <h3 class="text-lg font-semibold text-foreground mb-4">Applications Over Time</h3>
      <Chart v-if="lineChartData.labels && lineChartData.labels.length > 0" type="line" :data="lineChartData" :options="chartOptions" class="h-64" />
      <div v-else class="flex items-center justify-center h-64 text-foreground-muted">No data available</div>
            </div>

    <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-50">
      <h3 class="text-lg font-semibold text-foreground mb-4">Success Rate</h3>
      <Chart v-if="barChartData.labels && barChartData.labels.length > 0" type="bar" :data="barChartData" :options="chartOptions" class="h-64" />
      <div v-else class="flex items-center justify-center h-64 text-foreground-muted">No data available</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Card from 'primevue/card'
import Chart from 'primevue/chart'

const lineChartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Applications',
    data: [12, 19, 3, 5, 2, 3],
    borderColor: '#2563EB',
    tension: 0.4
  }]
})

const barChartData = ref({
  labels: ['Jobs', 'Scholarships', 'Activities'],
  datasets: [{
    label: 'Success Rate',
    data: [65, 59, 80],
    backgroundColor: ['#2563EB', '#10B981', '#F59E0B']
  }]
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false
})
</script>
