<template>
  <div class="rounded-md bg-white shadow-sm px-2 pb-0.5 border border-gray-50 mb-2">
    <h1 class="text-base font-semibold text-primary-500 capitalize">Opportunities</h1>
    <p class="text-sm font-extralight leading-tight">List view of opportunities</p>
  </div>

  <div class="relative overflow-x-auto shadow-sm sm:rounded-md">
    <DataTable 
      :value="opportunities" 
      ref="dt" 
      removableSort 
      size="normal" 
      v-model:filters="filters"
      v-model:selection="selectedOpportunities"
      :globalFilterFields="['title', 'organization', 'opportunity_type', 'location']" 
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
      :key="`opportunities-${first}-${rows}-${sortField}-${sortOrder}`"
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
            :value="slotProps.data[col.field] ? 'Active' : 'Inactive'" 
            :severity="slotProps.data[col.field] ? 'success' : 'secondary'"
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
              @click="router.push({ name: 'view-opportunity', params: { opportunityId: slotProps.data.id } })" 
              severity="secondary" 
              variant="text" 
              size="small"
              v-tooltip.top="'View'"
              class="text-primary-500 hover:bg-primary-100"
            />
            <Button 
              type="button" 
              icon="pi pi-pencil" 
              @click="router.push({ name: 'edit-opportunity', params: { opportunityId: slotProps.data.id } })" 
              severity="secondary" 
              variant="text" 
              size="small"
              v-tooltip.top="'Edit'"
              class="text-primary-500 hover:bg-primary-100"
            />
            <Button 
              type="button" 
              icon="pi pi-trash" 
              @click="deleteOpportunity(slotProps.data)" 
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

  <Dialog v-model:visible="showAddDialog" :style="{width: '450px'}" header="Opportunity Details" :modal="true" class="p-fluid">
    <div class="field" v-for="field in formFields" :key="field.key">
      <label :for="field.key">{{ field.label }}</label>
      <InputText v-if="field.type === 'text'" :id="field.key" v-model.trim="opportunity[field.key]" required="true" autofocus :class="{'p-invalid': submitted && !opportunity[field.key]}" />
      <Dropdown v-else-if="field.type === 'dropdown'" :id="field.key" v-model="opportunity[field.key]" :options="field.options" optionLabel="name" placeholder="Select" :class="{'p-invalid': submitted && !opportunity[field.key]}" />
      <Calendar v-else-if="field.type === 'date'" :id="field.key" v-model="opportunity[field.key]" dateFormat="yy-mm-dd" :class="{'p-invalid': submitted && !opportunity[field.key]}" />
      <Textarea v-else-if="field.type === 'textarea'" :id="field.key" v-model="opportunity[field.key]" rows="3" cols="20" />
      <small class="p-error" v-if="submitted && !opportunity[field.key]">{{field.label}} is required.</small>
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
      <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveOpportunity" />
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
import { opportunitiesAPI } from '@/api/opportunities'

const toast = useToast()
const confirm = useConfirm()
const router = useRouter()
const route = useRoute()

const opportunities = ref([])
const selectedOpportunities = ref([])
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

const opportunity = ref({
  title: '',
  organization: '',
  opportunity_type: '',
  location: '',
  deadline: null,
  is_active: true,
  description: ''
})

const formFields = ref([
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'organization', label: 'Organization', type: 'text', required: true },
  { 
    key: 'opportunity_type', 
    label: 'Type', 
    type: 'dropdown', 
    required: true,
    options: [
      { name: 'Job', value: 'job' },
      { name: 'Scholarship', value: 'scholarship' },
      { name: 'Internship', value: 'internship' },
      { name: 'Fellowship', value: 'fellowship' },
      { name: 'Grant', value: 'grant' }
    ]
  },
  { key: 'location', label: 'Location', type: 'text', required: false },
  { key: 'deadline', label: 'Deadline', type: 'date', required: false },
  { key: 'description', label: 'Description', type: 'textarea', required: false }
])

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const tableColumns = ref([
  { field: 'title', header: 'Title', sortable: true, filter: true },
  { field: 'organization', header: 'Organization', sortable: true, filter: true },
  { field: 'opportunity_type', header: 'Type', sortable: true, filter: true },
  { field: 'location', header: 'Location', sortable: true, filter: true },
  { field: 'deadline', header: 'Deadline', type: 'date', sortable: true },
  { field: 'is_active', header: 'Status', type: 'status', sortable: true, filter: true }
])

const selectedColumns = ref([])

const onToggle = (val) => {
  selectedColumns.value = val
}


const fetchOpportunities = async (params = {}) => {
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
    
    const response = await opportunitiesAPI.getOpportunities(queryParams)
    
    if (response && response.data) {
      const items = response.data.items || []
      opportunities.value = items.length > 0 ? JSON.parse(JSON.stringify(items)) : []
      totalRecords.value = response.data.total || 0
    } else {
      opportunities.value = []
      totalRecords.value = 0
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch opportunities',
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
  await fetchOpportunities({
    page: page,
    limit: event.rows
  })
}

const onSort = async (event) => {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder
  first.value = 0
  await fetchOpportunities({
    page: 1,
    limit: rows.value,
    sort_by: event.sortField,
    sort_order: event.sortOrder === 1 ? 'asc' : 'desc'
  })
}

const saveOpportunity = async () => {
  submitted.value = true
  if (!opportunity.value.title || !opportunity.value.organization) {
    return
  }

  try {
    if (editingItem.value) {
      await opportunitiesAPI.updateOpportunity(editingItem.value.id, opportunity.value)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Opportunity updated', life: 3000 })
    } else {
      await opportunitiesAPI.createOpportunity(opportunity.value)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Opportunity created', life: 3000 })
    }
    hideDialog()
    await fetchOpportunities({ page: 1, limit: rows.value })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save opportunity', life: 5000 })
  }
}

const deleteOpportunity = async (opportunityItem) => {
  confirm.require({
    message: 'Are you sure you want to delete this opportunity?',
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await opportunitiesAPI.deleteOpportunity(opportunityItem.id)
        await fetchOpportunities({ page: 1, limit: rows.value })
        toast.add({ severity: 'success', summary: 'Success', detail: 'Opportunity deleted', life: 3000 })
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete opportunity', life: 5000 })
      }
    }
  })
}

const hideDialog = () => {
  showAddDialog.value = false
  submitted.value = false
  editingItem.value = null
  opportunity.value = {
    title: '',
    organization: '',
    opportunity_type: '',
    location: '',
    deadline: null,
    is_active: true,
    description: ''
  }
}

const exportCSV = () => {
  dt.value.exportCSV()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString()
}


watch(() => filters.value.global?.value, (newVal) => {
  if (newVal !== null) {
    first.value = 0
    fetchOpportunities({ page: 1, limit: rows.value })
  }
}, { debounce: 300 })

onMounted(() => {
  selectedColumns.value = [...tableColumns.value]
  fetchOpportunities({ page: 1, limit: rows.value })
})
</script>

