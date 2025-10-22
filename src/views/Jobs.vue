<template>
  <MainLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Job Applications</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Track and manage your job applications</p>
        </div>
        <Button label="Add Job Application" icon="pi pi-plus" @click="showCreateDialog" />
      </div>

      <!-- Filters -->
      <Card>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
              <InputText v-model="filters.search" placeholder="Search jobs..." @input="handleFilter" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <Dropdown v-model="filters.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="All Status" @change="handleFilter" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
              <Dropdown v-model="filters.priority" :options="priorityOptions" optionLabel="label" optionValue="value" placeholder="All Priorities" @change="handleFilter" />
            </div>
            <div class="flex items-end">
              <Button label="Clear Filters" icon="pi pi-filter-slash" outlined @click="clearFilters" class="w-full" />
            </div>
          </div>
        </template>
      </Card>

      <!-- Data Table -->
      <Card>
        <template #content>
          <DataTable
            :value="jobsStore.jobs"
            :loading="jobsStore.loading"
            :paginator="true"
            :rows="10"
            :totalRecords="jobsStore.totalJobs"
            :lazy="true"
            @page="onPage"
            @sort="onSort"
            sortMode="multiple"
            filterDisplay="row"
            responsiveLayout="scroll"
            class="p-datatable-sm"
          >
            <template #empty>
              <div class="text-center py-8">
                <i class="pi pi-inbox text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600 dark:text-gray-400">No job applications found</p>
              </div>
            </template>

            <Column field="job_title" header="Job Title" :sortable="true" style="min-width: 200px">
              <template #body="slotProps">
                <div class="font-medium text-gray-900 dark:text-white">{{ slotProps.data.job_title }}</div>
                <div class="text-sm text-gray-500">{{ slotProps.data.company_name }}</div>
              </template>
            </Column>

            <Column field="location" header="Location" :sortable="true" style="min-width: 150px">
              <template #body="slotProps">
                <div class="flex items-center gap-2">
                  <i class="pi pi-map-marker text-gray-400"></i>
                  <span>{{ slotProps.data.location || slotProps.data.country || 'Remote' }}</span>
                </div>
              </template>
            </Column>

            <Column field="status" header="Status" :sortable="true" style="min-width: 150px">
              <template #body="slotProps">
                <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
              </template>
            </Column>

            <Column field="priority" header="Priority" :sortable="true" style="min-width: 120px">
              <template #body="slotProps">
                <Tag :value="slotProps.data.priority" :severity="getPrioritySeverity(slotProps.data.priority)" />
              </template>
            </Column>

            <Column field="applied_date" header="Applied Date" :sortable="true" style="min-width: 120px">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.applied_date) }}
              </template>
            </Column>

            <Column header="Actions" style="min-width: 150px">
              <template #body="slotProps">
                <div class="flex gap-2">
                  <Button icon="pi pi-eye" rounded text @click="viewJob(slotProps.data)" v-tooltip.top="'View'" />
                  <Button icon="pi pi-pencil" rounded text severity="info" @click="editJob(slotProps.data)" v-tooltip.top="'Edit'" />
                  <Button icon="pi pi-trash" rounded text severity="danger" @click="confirmDelete(slotProps.data)" v-tooltip.top="'Delete'" />
                </div>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>

    <!-- Create/Edit Dialog -->
    <Dialog v-model:visible="dialogVisible" :header="isEditing ? 'Edit Job Application' : 'Add Job Application'" :modal="true" :style="{ width: '50rem' }" :maximizable="true">
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-gray-700 dark:text-gray-300">Job Title *</label>
            <InputText v-model="formData.job_title" placeholder="e.g. Software Engineer" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-gray-700 dark:text-gray-300">Company Name *</label>
            <InputText v-model="formData.company_name" placeholder="e.g. Tech Corp" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-gray-700 dark:text-gray-300">Job Type</label>
            <Dropdown v-model="formData.job_type" :options="jobTypeOptions" optionLabel="label" optionValue="value" placeholder="Select job type" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-gray-700 dark:text-gray-300">Location</label>
            <InputText v-model="formData.location" placeholder="e.g. New York, USA" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-gray-700 dark:text-gray-300">Status</label>
            <Dropdown v-model="formData.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select status" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-gray-700 dark:text-gray-300">Priority</label>
            <Dropdown v-model="formData.priority" :options="priorityOptions" optionLabel="label" optionValue="value" placeholder="Select priority" />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-700 dark:text-gray-300">Job URL</label>
          <InputText v-model="formData.job_url" placeholder="https://..." />
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-700 dark:text-gray-300">Notes</label>
          <Textarea v-model="formData.notes" rows="4" placeholder="Add any notes..." />
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="dialogVisible = false" />
        <Button :label="isEditing ? 'Update' : 'Create'" icon="pi pi-check" :loading="saving" @click="saveJob" />
      </template>
    </Dialog>

    <!-- Delete Confirmation -->
    <ConfirmDialog />
  </MainLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useJobsStore } from '../stores/jobs'
import MainLayout from '../layouts/MainLayout.vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import ConfirmDialog from 'primevue/confirmdialog'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()
const jobsStore = useJobsStore()

const dialogVisible = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const filters = reactive({
  search: '',
  status: null,
  priority: null
})

const formData = reactive({
  job_title: '',
  company_name: '',
  job_type: 'full_time',
  location: '',
  status: 'not_applied',
  priority: 'medium',
  job_url: '',
  notes: ''
})

const statusOptions = [
  { label: 'Not Applied', value: 'not_applied' },
  { label: 'Applied', value: 'applied' },
  { label: 'Screening', value: 'screening' },
  { label: 'Interview', value: 'interview' },
  { label: 'Technical Assessment', value: 'technical_assessment' },
  { label: 'Offer', value: 'offer' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Withdrawn', value: 'withdrawn' },
  { label: 'Declined', value: 'declined' }
]

const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
]

const jobTypeOptions = [
  { label: 'Full Time', value: 'full_time' },
  { label: 'Part Time', value: 'part_time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Freelance', value: 'freelance' },
  { label: 'Internship', value: 'internship' },
  { label: 'Remote', value: 'remote' },
  { label: 'Hybrid', value: 'hybrid' }
]

const getStatusSeverity = (status) => {
  const severityMap = {
    not_applied: 'info',
    applied: 'primary',
    screening: 'info',
    interview: 'warning',
    technical_assessment: 'warning',
    offer: 'success',
    rejected: 'danger',
    accepted: 'success',
    withdrawn: 'secondary',
    declined: 'danger'
  }
  return severityMap[status] || 'info'
}

const getPrioritySeverity = (priority) => {
  const severityMap = {
    low: 'info',
    medium: 'warning',
    high: 'danger'
  }
  return severityMap[priority] || 'info'
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

const showCreateDialog = () => {
  isEditing.value = false
  resetForm()
  dialogVisible.value = true
}

const editJob = (job) => {
  isEditing.value = true
  Object.assign(formData, job)
  dialogVisible.value = true
}

const viewJob = (job) => {
  // TODO: Implement view modal
  console.log('View job:', job)
}

const resetForm = () => {
  formData.job_title = ''
  formData.company_name = ''
  formData.job_type = 'full_time'
  formData.location = ''
  formData.status = 'not_applied'
  formData.priority = 'medium'
  formData.job_url = ''
  formData.notes = ''
}

const saveJob = async () => {
  try {
    saving.value = true
    if (isEditing.value) {
      await jobsStore.updateJob(formData.id, formData)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Job updated successfully', life: 3000 })
    } else {
      await jobsStore.createJob(formData)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Job created successfully', life: 3000 })
    }
    dialogVisible.value = false
    resetForm()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save job', life: 5000 })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (job) => {
  confirm.require({
    message: `Are you sure you want to delete the application for ${job.job_title}?`,
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteJob(job.id)
  })
}

const deleteJob = async (id) => {
  try {
    await jobsStore.deleteJob(id)
    toast.add({ severity: 'success', summary: 'Success', detail: 'Job deleted successfully', life: 3000 })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete job', life: 5000 })
  }
}

const handleFilter = () => {
  fetchJobs()
}

const clearFilters = () => {
  filters.search = ''
  filters.status = null
  filters.priority = null
  fetchJobs()
}

const onPage = (event) => {
  fetchJobs({ skip: event.first, limit: event.rows })
}

const onSort = (event) => {
  console.log('Sort:', event)
}

const fetchJobs = async (params = {}) => {
  const queryParams = {
    ...params,
    search: filters.search || undefined,
    status: filters.status || undefined,
    priority: filters.priority || undefined
  }
  await jobsStore.fetchJobs(queryParams)
}

onMounted(() => {
  fetchJobs()
})
</script>
