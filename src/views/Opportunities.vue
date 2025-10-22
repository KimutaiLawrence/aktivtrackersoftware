<template>
  <MainLayout>
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Opportunities</h1>

      <Card>
        <template #content>
          <DataTable :value="opportunities" :loading="loading" :paginator="true" :rows="10">
            <Column field="title" header="Title" :sortable="true" />
            <Column field="organization" header="Organization" :sortable="true" />
            <Column field="opportunity_type" header="Type" :sortable="true">
              <template #body="slotProps">
                <Tag :value="slotProps.data.opportunity_type" />
              </template>
            </Column>
            <Column field="location" header="Location" :sortable="true" />
            <Column field="deadline" header="Deadline" :sortable="true">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.deadline) }}
              </template>
            </Column>
            <Column header="Actions">
              <template #body="slotProps">
                <Button label="Apply" size="small" @click="apply(slotProps.data)" />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { opportunitiesAPI } from '../api'
import MainLayout from '../layouts/MainLayout.vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'

const opportunities = ref([])
const loading = ref(false)

const fetchOpportunities = async () => {
  try {
    loading.value = true
    const response = await opportunitiesAPI.getOpportunities()
    opportunities.value = response.data.items || []
  } catch (error) {
    console.error('Failed to fetch opportunities:', error)
  } finally {
    loading.value = false
  }
}

const apply = (opportunity) => {
  console.log('Apply to:', opportunity)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

onMounted(() => fetchOpportunities())
</script>
