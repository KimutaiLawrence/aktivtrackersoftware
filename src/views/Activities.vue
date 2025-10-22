<template>
  <MainLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Activities</h1>
        <Button label="Add Activity" icon="pi pi-plus" @click="showDialog" />
      </div>

      <Card>
        <template #content>
          <DataTable :value="activitiesStore.activities" :loading="activitiesStore.loading" :paginator="true" :rows="10">
            <Column field="title" header="Title" :sortable="true" />
            <Column field="activity_type" header="Type" :sortable="true">
              <template #body="slotProps">
                <Tag :value="slotProps.data.activity_type" />
              </template>
            </Column>
            <Column field="category" header="Category" :sortable="true">
              <template #body="slotProps">
                <Tag :value="slotProps.data.category" severity="info" />
              </template>
            </Column>
            <Column field="status" header="Status" :sortable="true">
              <template #body="slotProps">
                <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
              </template>
            </Column>
            <Column field="priority" header="Priority" :sortable="true">
              <template #body="slotProps">
                <Tag :value="slotProps.data.priority" :severity="getPrioritySeverity(slotProps.data.priority)" />
              </template>
            </Column>
            <Column header="Actions">
              <template #body="slotProps">
                <Button icon="pi pi-pencil" rounded text @click="edit(slotProps.data)" />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>

    <Dialog v-model:visible="dialogVisible" header="Activity" :modal="true" :style="{ width: '50rem' }">
      <div class="space-y-4">
        <div class="flex flex-col gap-2">
          <label>Title *</label>
          <InputText v-model="formData.title" />
        </div>
        <div class="flex flex-col gap-2">
          <label>Description</label>
          <Textarea v-model="formData.description" rows="3" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label>Type</label>
            <Dropdown v-model="formData.activity_type" :options="activityTypes" />
          </div>
          <div class="flex flex-col gap-2">
            <label>Category</label>
            <Dropdown v-model="formData.category" :options="categories" />
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" text @click="dialogVisible = false" />
        <Button label="Save" @click="save" />
      </template>
    </Dialog>
  </MainLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useActivitiesStore } from '../stores/activities'
import MainLayout from '../layouts/MainLayout.vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'

const activitiesStore = useActivitiesStore()
const dialogVisible = ref(false)
const formData = reactive({ title: '', description: '', activity_type: 'personal', category: 'work' })

const activityTypes = ['personal', 'professional', 'networking', 'learning', 'research']
const categories = ['work', 'education', 'career_development', 'skill_building', 'other']

const getStatusSeverity = (status) => {
  return { planned: 'info', in_progress: 'warning', completed: 'success' }[status] || 'info'
}

const getPrioritySeverity = (priority) => {
  return { low: 'info', medium: 'warning', high: 'danger' }[priority] || 'info'
}

const showDialog = () => { dialogVisible.value = true }
const edit = (data) => { Object.assign(formData, data); dialogVisible.value = true }
const save = async () => {
  await activitiesStore.createActivity(formData)
  dialogVisible.value = false
}

onMounted(() => activitiesStore.fetchActivities())
</script>
