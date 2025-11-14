<template>
  <div class="rounded-md bg-white shadow-sm px-2 pb-0.5 border border-gray-50 mb-2">
    <h1 class="text-base font-semibold text-primary-500 capitalize">Activities</h1>
    <p class="text-sm font-extralight leading-tight">List view of activities</p>
  </div>

  <div class="relative overflow-x-auto shadow-sm sm:rounded-md">
    <DataTable 
      :value="activities" 
      ref="dt" 
      removableSort 
      size="normal" 
      v-model:filters="filters"
      v-model:selection="selectedActivities"
      :globalFilterFields="['title', 'activity_type', 'category', 'status']" 
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
      :key="`activities-${first}-${rows}-${sortField}-${sortOrder}`"
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
              @click="router.push({ name: 'view-activity', params: { activityId: slotProps.data.id } })" 
              severity="secondary" 
              variant="text" 
              size="small"
              v-tooltip.top="'View'"
              class="text-primary-500 hover:bg-primary-100"
            />
            <Button 
              type="button" 
              icon="pi pi-pencil" 
              @click="router.push({ name: 'edit-activity', params: { activityId: slotProps.data.id } })" 
              severity="secondary" 
              variant="text" 
              size="small"
              v-tooltip.top="'Edit'"
              class="text-primary-500 hover:bg-primary-100"
            />
            <Button 
              type="button" 
              icon="pi pi-trash" 
              @click="deleteActivity(slotProps.data)" 
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

  <Dialog v-model:visible="showAddDialog" :style="{width: '450px'}" header="Activity Details" :modal="true" class="p-fluid">
    <div class="field" v-for="field in formFields" :key="field.key">
      <label :for="field.key">{{ field.label }}</label>
      <InputText v-if="field.type === 'text'" :id="field.key" v-model.trim="activity[field.key]" required="true" autofocus :class="{'p-invalid': submitted && !activity[field.key]}" />
      <Dropdown v-else-if="field.type === 'dropdown'" :id="field.key" v-model="activity[field.key]" :options="field.options" optionLabel="name" placeholder="Select" :class="{'p-invalid': submitted && !activity[field.key]}" />
      <Calendar v-else-if="field.type === 'date'" :id="field.key" v-model="activity[field.key]" dateFormat="yy-mm-dd" :class="{'p-invalid': submitted && !activity[field.key]}" />
      <Textarea v-else-if="field.type === 'textarea'" :id="field.key" v-model="activity[field.key]" rows="3" cols="20" />
      <small class="p-error" v-if="submitted && !activity[field.key]">{{field.label}} is required.</small>
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
      <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveActivity" />
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
import { MultiSelect, Button, IconField, InputIcon, InputText, Tag, Dialog, Dropdown, Calendar, Textarea, ConfirmDialog, Toast } from 'primevue'
import Tooltip from 'primevue/tooltip'
import { useConfirm } from 'primevue/useconfirm'
import { activitiesAPI } from '@/api/activities'

const toast = useToast()
const confirm = useConfirm()
const router = useRouter()
const route = useRoute()

const activities = ref([])
const selectedActivities = ref([])
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

const activity = ref({
  title: '',
  activity_type: '',
  category: '',
  status: 'planned',
  priority: 'medium',
  scheduled_date: null,
  due_date: null,
  notes: ''
})

const formFields = ref([
  { key: 'title', label: 'Title', type: 'text', required: true },
  { 
    key: 'activity_type', 
    label: 'Activity Type', 
    type: 'dropdown', 
    required: true,
    options: [
      { name: 'Personal', value: 'personal' },
      { name: 'Professional', value: 'professional' },
      { name: 'Networking', value: 'networking' },
      { name: 'Learning', value: 'learning' },
      { name: 'Research', value: 'research' },
      { name: 'Meeting', value: 'meeting' },
      { name: 'Other', value: 'other' }
    ]
  },
  { 
    key: 'category', 
    label: 'Category', 
    type: 'dropdown', 
    required: true,
    options: [
      { name: 'Work', value: 'work' },
      { name: 'Education', value: 'education' },
      { name: 'Career Development', value: 'career_development' },
      { name: 'Skill Building', value: 'skill_building' },
      { name: 'Other', value: 'other' }
    ]
  },
  { 
    key: 'status', 
    label: 'Status', 
    type: 'dropdown', 
    required: true,
    options: [
      { name: 'Planned', value: 'planned' },
      { name: 'In Progress', value: 'in_progress' },
      { name: 'Completed', value: 'completed' },
      { name: 'Cancelled', value: 'cancelled' }
    ]
  },
  { key: 'scheduled_date', label: 'Scheduled Date', type: 'date', required: false },
  { key: 'due_date', label: 'Due Date', type: 'date', required: false },
  { key: 'notes', label: 'Notes', type: 'textarea', required: false }
])

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const tableColumns = ref([
  { field: 'title', header: 'Title', sortable: true, filter: true },
  { field: 'activity_type', header: 'Type', sortable: true, filter: true },
  { field: 'category', header: 'Category', sortable: true, filter: true },
  { field: 'status', header: 'Status', type: 'status', sortable: true, filter: true },
  { field: 'priority', header: 'Priority', sortable: true, filter: true },
  { field: 'scheduled_date', header: 'Scheduled Date', type: 'date', sortable: true },
  { field: 'due_date', header: 'Due Date', type: 'date', sortable: true }
])

const selectedColumns = ref([])

const onToggle = (val) => {
  selectedColumns.value = val
}


const fetchActivities = async (params = {}) => {
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
    
    const response = await activitiesAPI.getActivities(queryParams)
    
    if (response && response.data) {
      const items = response.data.items || []
      activities.value = items.length > 0 ? JSON.parse(JSON.stringify(items)) : []
      totalRecords.value = response.data.total || 0
    } else {
      activities.value = []
      totalRecords.value = 0
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch activities',
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
  await fetchActivities({
    page: page,
    limit: event.rows
  })
}

const onSort = async (event) => {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder
  first.value = 0
  await fetchActivities({
    page: 1,
    limit: rows.value,
    sort_by: event.sortField,
    sort_order: event.sortOrder === 1 ? 'asc' : 'desc'
  })
}

const saveActivity = async () => {
  submitted.value = true
  if (!activity.value.title || !activity.value.activity_type) {
    return
  }

  try {
    if (editingItem.value) {
      await activitiesAPI.updateActivity(editingItem.value.id, activity.value)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Activity updated', life: 3000 })
    } else {
      await activitiesAPI.createActivity(activity.value)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Activity created', life: 3000 })
    }
    hideDialog()
    await fetchActivities({ page: 1, limit: rows.value })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save activity', life: 5000 })
  }
}

const deleteActivity = async (activityItem) => {
  confirm.require({
    message: 'Are you sure you want to delete this activity?',
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await activitiesAPI.deleteActivity(activityItem.id)
        await fetchActivities({ page: 1, limit: rows.value })
        toast.add({ severity: 'success', summary: 'Success', detail: 'Activity deleted', life: 3000 })
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete activity', life: 5000 })
      }
    }
  })
}

const hideDialog = () => {
  showAddDialog.value = false
  submitted.value = false
  editingItem.value = null
  activity.value = {
    title: '',
    activity_type: '',
    category: '',
    status: 'planned',
    priority: 'medium',
    scheduled_date: null,
    due_date: null,
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
    'planned': 'secondary',
    'in_progress': 'info',
    'completed': 'success',
    'cancelled': 'danger',
    'postponed': 'warning'
  }
  return statusMap[status] || 'info'
}

watch(() => filters.value.global?.value, (newVal) => {
  if (newVal !== null) {
    first.value = 0
    fetchActivities({ page: 1, limit: rows.value })
  }
}, { debounce: 300 })

onMounted(() => {
  selectedColumns.value = [...tableColumns.value]
  fetchActivities({ page: 1, limit: rows.value })
})
</script>

