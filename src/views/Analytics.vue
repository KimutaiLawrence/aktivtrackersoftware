<template>
  <MainLayout>
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <template #header>
            <div class="p-4 border-b">
              <h3 class="text-lg font-semibold">Applications Over Time</h3>
            </div>
          </template>
          <template #content>
            <Chart type="line" :data="lineChartData" :options="chartOptions" />
          </template>
        </Card>

        <Card>
          <template #header>
            <div class="p-4 border-b">
              <h3 class="text-lg font-semibold">Success Rate</h3>
            </div>
          </template>
          <template #content>
            <Chart type="bar" :data="barChartData" :options="chartOptions" />
          </template>
        </Card>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
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
