<template>
  <div class="rounded-md bg-white shadow-sm px-2 pb-0.5 border border-gray-50 mb-2">
    <h1 class="text-base font-semibold text-primary-500 capitalize">Job Applications</h1>
    <p class="text-sm font-extralight leading-tight">List view of job applications</p>
  </div>

  <div class="relative overflow-x-auto shadow-sm sm:rounded-md">
    <DataTable 
      :value="jobs" 
      ref="dt" 
      removableSort 
      size="small" 
      v-model:filters="filters"
      v-model:selection="selectedJobs"
      :globalFilterFields="['job_title', 'company_name', 'location', 'status']" 
      :loading="loading"
      paginator 
      :rows="rows" 
      :first="first"
      :rowsPerPageOptions="[5, 10, 20, 50]" 
      :totalRecords="totalRecords"
      paginator-template="CurrentPageReport RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      tableStyle="min-width: 20rem" 
      lazy
      :sortField="sortField"
      :sortOrder="sortOrder"
      :key="`jobs-${first}-${rows}-${sortField}-${sortOrder}`"
      @page="onPageChange"
      @sort="onSort"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <IconField>
            <InputIcon>
              <i class="pi pi-search !text-xs" />
            </InputIcon>
            <InputText 
              v-model="filters['global'].value" 
              placeholder="Search" 
              size="small"
              class="!text-xs" 
              showClear
            />
          </IconField>

          <div class="flex gap-2">
            <MultiSelect 
              :modelValue="selectedColumns" 
              :options="tableColumns" 
              optionLabel="header" 
              size="small" 
              class="w-36 !text-xs" 
              @update:modelValue="onToggle"
              display="chip" 
              placeholder="Select Columns" 
            />
            <Button 
              icon="pi pi-file-export" 
              label="Export" 
              @click="exportCSV($event)" 
              size="small"
            />
            <Button 
              icon="pi pi-plus" 
              label="Add New" 
              @click="showAddDialog = true"
              size="small"
              class="bg-primary-500 text-white"
            />
          </div>
        </div>
      </template>

      <template #empty>
        <div class="flex items-center justify-center">
          No data
        </div>
      </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

      <Column headerStyle="width: 3rem; text-align: center" bodyStyle="text-align: center">
        <template #header>#</template>
        <template #body="slotProps">
          {{ first + slotProps.index + 1 }}
        </template>
      </Column>

      <Column 
        v-for="(col, index) of selectedColumns" 
        :field="col.field" 
        :header="col.header" 
        :key="col.field + '_' + index"
        :sortable="col.sortable !== false"
        :filter="col.filter !== false"
      >
        <template #body="slotProps" v-if="col.type === 'status'">
          <Tag 
            :value="slotProps.data[col.field]" 
            :severity="getStatusSeverity(slotProps.data[col.field])"
          />
        </template>
        <template #body="slotProps" v-else-if="col.type === 'date'">
          {{ formatDate(slotProps.data[col.field]) }}
        </template>
      </Column>

      <Column headerStyle="width: 8rem; text-align: center" bodyStyle="text-align: center; overflow: visible">
        <template #header>Actions</template>
        <template #body="slotProps">
          <div class="flex gap-2 justify-center items-center">
            <Button 
              type="button" 
              icon="pi pi-eye" 
              @click="router.push({ name: 'view-job', params: { jobId: slotProps.data.id } })" 
              severity="secondary" 
              variant="text" 
              size="small"
              v-tooltip.top="'View'"
              class="text-primary-500 hover:bg-primary-100"
            />
            <Button 
              type="button" 
              icon="pi pi-pencil" 
              @click="router.push({ name: 'edit-job', params: { jobId: slotProps.data.id } })" 
              severity="secondary" 
              variant="text" 
              size="small"
              v-tooltip.top="'Edit'"
              class="text-primary-500 hover:bg-primary-100"
            />
            <Button 
              type="button" 
              icon="pi pi-trash" 
              @click="deleteJob(slotProps.data)" 
              severity="danger" 
              variant="text" 
              size="small"
              v-tooltip.top="'Delete'"
              class="text-red-500 hover:bg-red-100"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>

  <Dialog 
    v-model:visible="showAddDialog" 
    :header="editingItem ? 'Edit Job Application' : 'Add New Job Application'"
    :modal="true" 
    class="p-fluid"
    :style="{ width: '60vw', maxWidth: '800px' }"
  >
    <div class="space-y-6">
      <!-- Basic Information Section -->
      <div class="border-b border-gray-200 pb-4">
        <h3 class="text-sm font-semibold text-foreground mb-4">Basic Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="field">
            <label :for="'job_title'" class="text-sm font-medium">
              Job Title <span class="text-red-500">*</span>
            </label>
            <InputText 
              id="job_title"
              v-model="formData.job_title"
              placeholder="e.g., Software Engineer"
              class="mt-1"
            />
          </div>
          <div class="field">
            <label :for="'company_name'" class="text-sm font-medium">
              Company Name <span class="text-red-500">*</span>
            </label>
            <InputText 
              id="company_name"
              v-model="formData.company_name"
              placeholder="e.g., Tech Corp"
              class="mt-1"
            />
          </div>
          <div class="field">
            <label :for="'location'" class="text-sm font-medium">
              Location <span class="text-red-500">*</span>
            </label>
            <InputText 
              id="location"
              v-model="formData.location"
              placeholder="e.g., New York, NY"
              class="mt-1"
            />
          </div>
          <div class="field">
            <label :for="'job_type'" class="text-sm font-medium">
              Job Type <span class="text-red-500">*</span>
            </label>
            <Dropdown 
              id="job_type"
              v-model="formData.job_type"
              :options="['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']"
              placeholder="Select job type"
              class="mt-1"
            />
          </div>
        </div>
      </div>

      <!-- Status & Priority Section -->
      <div class="border-b border-gray-200 pb-4">
        <h3 class="text-sm font-semibold text-foreground mb-4">Status & Priority</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="field">
            <label :for="'status'" class="text-sm font-medium">
              Status <span class="text-red-500">*</span>
            </label>
            <Dropdown 
              id="status"
              v-model="formData.status"
              :options="['Applied', 'Interview', 'Offer', 'Rejected', 'Pending']"
              placeholder="Select status"
              class="mt-1"
            />
          </div>
          <div class="field">
            <label :for="'priority'" class="text-sm font-medium">
              Priority <span class="text-red-500">*</span>
            </label>
            <Dropdown 
              id="priority"
              v-model="formData.priority"
              :options="['High', 'Medium', 'Low']"
              placeholder="Select priority"
              class="mt-1"
            />
          </div>
        </div>
      </div>

      <!-- Dates Section -->
      <div class="border-b border-gray-200 pb-4">
        <h3 class="text-sm font-semibold text-foreground mb-4">Important Dates</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="field">
            <label :for="'applied_date'" class="text-sm font-medium">
              Applied Date <span class="text-red-500">*</span>
            </label>
            <Calendar 
              id="applied_date"
              v-model="formData.applied_date"
              placeholder="Select date"
              dateFormat="yy-mm-dd"
              class="mt-1 w-full"
            />
          </div>
          <div class="field">
            <label :for="'deadline'" class="text-sm font-medium">
              Deadline <span class="text-gray-400 text-xs">(Optional)</span>
            </label>
            <Calendar 
              id="deadline"
              v-model="formData.deadline"
              placeholder="Select deadline (optional)"
              dateFormat="yy-mm-dd"
              class="mt-1 w-full"
            />
          </div>
        </div>
      </div>

      <!-- Additional Notes Section -->
      <div>
        <h3 class="text-sm font-semibold text-foreground mb-4">Additional Information</h3>
        <div class="field">
          <label :for="'notes'" class="text-sm font-medium">
            Notes <span class="text-gray-400 text-xs">(Optional)</span>
          </label>
          <Textarea 
            id="notes"
            v-model="formData.notes"
            placeholder="Enter any additional notes or comments..."
            :rows="4"
            class="mt-1"
          />
        </div>
      </div>
    </div>
    
    <template #footer>
      <Button 
        label="Cancel" 
        icon="pi pi-times" 
        @click="closeDialog"
        class="p-button-text"
        size="small"
      />
      <Button 
        :label="editingItem ? 'Update' : 'Save'" 
        icon="pi pi-check" 
        @click="saveItem"
        :loading="saving"
        class="bg-primary-500 text-white"
        size="small"
      />
    </template>
  </Dialog>

  <ConfirmDialog></ConfirmDialog>
  <Toast />
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRoute, useRouter } from 'vue-router'
import { FilterMatchMode } from '@primevue/core/api'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { MultiSelect, Button, IconField, InputIcon, InputText, Dialog, InputText as PrimeInputText, Textarea, Dropdown, Calendar, Tag, ConfirmDialog, Toast } from 'primevue'
import Tooltip from 'primevue/tooltip'
import { useConfirm } from 'primevue/useconfirm'
import { jobsAPI } from '@/api/jobs'

const toast = useToast()
const confirm = useConfirm()
const router = useRouter()
const route = useRoute()

const jobs = ref([])
const selectedJobs = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const dt = ref()
const showAddDialog = ref(false)
const editingItem = ref(null)
const saving = ref(false)
const formData = ref({})
const first = ref(0)
const rows = ref(10)
const sortField = ref('created_at')
const sortOrder = ref(-1)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const tableColumns = ref([
  { field: 'job_title', header: 'Job Title', sortable: true, filter: true },
  { field: 'company_name', header: 'Company', sortable: true, filter: true },
  { field: 'location', header: 'Location', sortable: true, filter: true },
  { field: 'job_type', header: 'Type', sortable: true, filter: true },
  { field: 'status', header: 'Status', type: 'status', sortable: true, filter: true },
  { field: 'priority', header: 'Priority', sortable: true, filter: true },
  { field: 'applied_date', header: 'Applied Date', type: 'date', sortable: true },
  { field: 'deadline', header: 'Deadline', type: 'date', sortable: true }
])

const selectedColumns = ref([])

const onToggle = (val) => {
  selectedColumns.value = val
}

const fetchJobs = async (params = {}) => {
  try {
    loading.value = true
    
    // Calculate page from first and rows
    const currentPage = params.page !== undefined ? params.page : Math.floor(first.value / rows.value) + 1
    
    const queryParams = {
      page: currentPage,
      limit: params.limit !== undefined ? params.limit : rows.value,
      sort_by: params.sort_by || sortField.value,
      sort_order: params.sort_order || (sortOrder.value === 1 ? 'asc' : 'desc')
    }
    
    if (filters.value.global?.value) {
      queryParams.search = filters.value.global.value
    }
    
    const response = await jobsAPI.getJobApplications(queryParams)
    
    if (response && response.data) {
      const items = response.data.items || []
      // Create completely new array to ensure reactivity
      jobs.value = items.length > 0 ? JSON.parse(JSON.stringify(items)) : []
      totalRecords.value = response.data.total || 0
    } else {
      jobs.value = []
      totalRecords.value = 0
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch job applications',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const onPageChange = async (event) => {
  first.value = event.first
  rows.value = event.rows
  const page = Math.floor(event.first / event.rows) + 1
  await fetchJobs({
    page: page,
    limit: event.rows
  })
}

const onSort = async (event) => {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder
  first.value = 0
  await fetchJobs({
    page: 1,
    limit: rows.value,
    sort_by: event.sortField,
    sort_order: event.sortOrder === 1 ? 'asc' : 'desc'
  })
}

const saveItem = async () => {
  try {
    saving.value = true
    if (editingItem.value) {
      await jobsAPI.updateJobApplication(editingItem.value.id, formData.value)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Job application updated', life: 3000 })
    } else {
      await jobsAPI.createJobApplication(formData.value)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Job application created', life: 3000 })
    }
    closeDialog()
    await fetchJobs({ page: 1, limit: rows.value })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save job application', life: 5000 })
  } finally {
    saving.value = false
  }
}

const deleteJob = async (job) => {
  confirm.require({
    message: 'Are you sure you want to delete this job application?',
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await jobsAPI.deleteJobApplication(job.id)
        first.value = 0
        await fetchJobs({ skip: 0, limit: rows.value })
        toast.add({ severity: 'success', summary: 'Success', detail: 'Job application deleted', life: 3000 })
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete job application', life: 5000 })
      }
    }
  })
}

const closeDialog = () => {
  showAddDialog.value = false
  editingItem.value = null
  formData.value = {}
}

const exportCSV = () => {
  dt.value.exportCSV()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString()
}

const getStatusSeverity = (status) => {
  const statusMap = {
    'Applied': 'info',
    'Interview': 'warning',
    'Offer': 'success',
    'Rejected': 'danger',
    'Pending': 'secondary'
  }
  return statusMap[status] || 'info'
}

watch(() => filters.value.global?.value, (newVal) => {
  if (newVal !== null) {
    first.value = 0
    fetchJobs({ page: 1, limit: rows.value })
  }
}, { debounce: 300 })

onMounted(() => {
  selectedColumns.value = [...tableColumns.value]
  fetchJobs({ page: 1, limit: rows.value })
})
</script>
