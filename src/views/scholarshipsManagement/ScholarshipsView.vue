<template>
  <div class="rounded-md bg-white shadow-sm px-2 pb-0.5 border border-gray-50 mb-2">
    <h1 class="text-base font-semibold text-primary-500 capitalize">Scholarship Applications</h1>
    <p class="text-sm font-extralight leading-tight">List view of scholarship applications</p>
  </div>

  <div class="relative overflow-x-auto shadow-sm sm:rounded-md">
      <DataTable 
      :value="scholarships" 
      ref="dt" 
      removableSort 
      size="small" 
      v-model:filters="filters"
      v-model:selection="selectedScholarships"
      :globalFilterFields="['program_name', 'institution', 'field_of_study', 'status']" 
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
      :key="`scholarships-${first}-${rows}-${sortField}-${sortOrder}`"
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
              @click="router.push({ name: 'view-scholarship', params: { scholarshipId: slotProps.data.id } })" 
              severity="secondary" 
              variant="text" 
              size="small"
              v-tooltip.top="'View'"
              class="text-primary-500 hover:bg-primary-100"
            />
            <Button 
              type="button" 
              icon="pi pi-pencil" 
              @click="router.push({ name: 'edit-scholarship', params: { scholarshipId: slotProps.data.id } })" 
              severity="secondary" 
              variant="text" 
              size="small"
              v-tooltip.top="'Edit'"
              class="text-primary-500 hover:bg-primary-100"
            />
            <Button 
              type="button" 
              icon="pi pi-trash" 
              @click="confirmDelete(slotProps.data)" 
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

  <Dialog v-model:visible="showAddDialog" :style="{width: '450px'}" header="Scholarship Application Details" :modal="true" class="p-fluid">
    <div class="field" v-for="field in formFields" :key="field.key">
      <label :for="field.key">{{ field.label }}</label>
      <InputText v-if="field.type === 'text'" :id="field.key" v-model.trim="scholarship[field.key]" required="true" autofocus :class="{'p-invalid': submitted && !scholarship[field.key]}" />
      <Dropdown v-else-if="field.type === 'dropdown'" :id="field.key" v-model="scholarship[field.key]" :options="field.options" optionLabel="name" placeholder="Select" :class="{'p-invalid': submitted && !scholarship[field.key]}" />
      <Calendar v-else-if="field.type === 'date'" :id="field.key" v-model="scholarship[field.key]" dateFormat="yy-mm-dd" :class="{'p-invalid': submitted && !scholarship[field.key]}" />
      <Textarea v-else-if="field.type === 'textarea'" :id="field.key" v-model="scholarship[field.key]" rows="3" cols="20" />
      <small class="p-error" v-if="submitted && !scholarship[field.key]">{{field.label}} is required.</small>
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
      <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveScholarship" />
    </template>
  </Dialog>

  <ConfirmDialog></ConfirmDialog>
  <Toast />
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useRoute, useRouter } from 'vue-router'
import { FilterMatchMode } from '@primevue/core/api'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { MultiSelect, Button, IconField, InputIcon, InputText, Tag, Dialog, Dropdown, Calendar, Textarea, ConfirmDialog, Toast } from 'primevue'
import Tooltip from 'primevue/tooltip'
import { scholarshipsAPI } from '@/api/scholarships'

const toast = useToast()
const confirm = useConfirm()
const router = useRouter()
const route = useRoute()

const scholarships = ref([])
const selectedScholarships = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const dt = ref()
const showAddDialog = ref(false)
const submitted = ref(false)
const editingItem = ref(null)
const first = ref(0)
const rows = ref(10)
const sortField = ref('created_at')
const sortOrder = ref(-1)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const tableColumns = ref([
  { field: 'program_name', header: 'Program Name', sortable: true, filter: true },
  { field: 'institution', header: 'Institution', sortable: true, filter: true },
  { field: 'degree_level', header: 'Degree Level', sortable: true, filter: true },
  { field: 'field_of_study', header: 'Field of Study', sortable: true, filter: true },
  { field: 'status', header: 'Status', type: 'status', sortable: true, filter: true },
  { field: 'priority', header: 'Priority', sortable: true, filter: true },
  { field: 'submission_deadline', header: 'Deadline', type: 'date', sortable: true }
])

const selectedColumns = ref([])

const onToggle = (val) => {
  selectedColumns.value = val
}

const scholarship = ref({
  program_name: '',
  institution: '',
  degree_level: '',
  field_of_study: '',
  status: '',
  priority: 'medium',
  submission_deadline: null,
  notes: ''
})

const formFields = ref([
  { key: 'program_name', label: 'Program Name', type: 'text', required: true },
  { key: 'institution', label: 'Institution', type: 'text', required: true },
  { 
    key: 'degree_level', 
    label: 'Degree Level', 
    type: 'dropdown', 
    required: true,
    options: [
      { name: 'Bachelors', value: 'bachelors' },
      { name: 'Masters', value: 'masters' },
      { name: 'PhD', value: 'phd' },
      { name: 'Diploma', value: 'diploma' },
      { name: 'Certificate', value: 'certificate' }
    ]
  },
  { key: 'field_of_study', label: 'Field of Study', type: 'text', required: true },
  { 
    key: 'status', 
    label: 'Status', 
    type: 'dropdown', 
    required: true,
    options: [
      { name: 'Not Started', value: 'not_started' },
      { name: 'In Progress', value: 'in_progress' },
      { name: 'Submitted', value: 'submitted' },
      { name: 'Under Review', value: 'under_review' },
      { name: 'Accepted', value: 'accepted' },
      { name: 'Rejected', value: 'rejected' }
    ]
  },
  { key: 'submission_deadline', label: 'Submission Deadline', type: 'date', required: false },
  { key: 'notes', label: 'Notes', type: 'textarea', required: false }
])

const fetchScholarships = async (params = {}) => {
  try {
    loading.value = true
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
    
    const response = await scholarshipsAPI.getScholarshipApplications(queryParams)
    
    if (response && response.data) {
      const items = response.data.items || []
      scholarships.value = items.length > 0 ? JSON.parse(JSON.stringify(items)) : []
      totalRecords.value = response.data.total || 0
    } else {
      scholarships.value = []
      totalRecords.value = 0
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch scholarships',
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
  await fetchScholarships({
    page: page,
    limit: event.rows
  })
}

const onSort = async (event) => {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder
  first.value = 0
  await fetchScholarships({
    page: 1,
    limit: rows.value,
    sort_by: event.sortField,
    sort_order: event.sortOrder === 1 ? 'asc' : 'desc'
  })
}

const saveScholarship = async () => {
  submitted.value = true
  if (!scholarship.value.program_name || !scholarship.value.institution) {
    return
  }

  try {
    if (editingItem.value) {
      await scholarshipsAPI.updateScholarshipApplication(editingItem.value.id, scholarship.value)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Scholarship updated', life: 3000 })
    } else {
      await scholarshipsAPI.createScholarshipApplication(scholarship.value)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Scholarship created', life: 3000 })
    }
    hideDialog()
    first.value = 0
    await fetchScholarships({ page: 1, limit: rows.value })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save scholarship', life: 5000 })
  }
}

const confirmDelete = (scholarship) => {
  confirm.require({
    message: 'Are you sure you want to delete this scholarship application?',
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await scholarshipsAPI.deleteScholarshipApplication(scholarship.id)
        first.value = 0
        await fetchScholarships({ page: 1, limit: rows.value })
        toast.add({ severity: 'success', summary: 'Success', detail: 'Scholarship deleted', life: 3000 })
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete scholarship', life: 5000 })
      }
    }
  })
}

const hideDialog = () => {
  showAddDialog.value = false
  submitted.value = false
  editingItem.value = null
  scholarship.value = {
    program_name: '',
    institution: '',
    degree_level: '',
    field_of_study: '',
    status: '',
    priority: 'medium',
    submission_deadline: null,
    notes: ''
  }
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
    'not_started': 'secondary',
    'in_progress': 'info',
    'submitted': 'info',
    'under_review': 'warning',
    'accepted': 'success',
    'rejected': 'danger',
    'waitlisted': 'warning',
    'withdrawn': 'secondary',
    'deferred': 'info'
  }
  return statusMap[status] || 'info'
}

watch(() => filters.value.global?.value, (newVal) => {
  if (newVal !== null) {
    first.value = 0
    fetchScholarships({ page: 1, limit: rows.value })
  }
}, { debounce: 300 })

onMounted(() => {
  selectedColumns.value = [...tableColumns.value]
  fetchScholarships({ page: 1, limit: rows.value })
})
</script>
