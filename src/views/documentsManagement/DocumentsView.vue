<template>
  <div class="rounded-md bg-white shadow-sm px-2 pb-0.5 border border-gray-50 mb-2">
    <h1 class="text-base font-semibold text-primary-500 capitalize">Documents</h1>
    <p class="text-sm font-extralight leading-tight">List view of documents</p>
  </div>

  <div class="relative overflow-x-auto shadow-sm sm:rounded-md">
    <DataTable 
      :value="documents" 
      ref="dt" 
      removableSort 
      size="normal" 
      v-model:filters="filters"
      v-model:selection="selectedDocuments"
      :globalFilterFields="['document_name', 'document_type', 'application_type']" 
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
      :key="`documents-${first}-${rows}-${sortField}-${sortOrder}`"
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
        <template #body="slotProps" v-if="col.type === 'date'">
          {{ formatDate(slotProps.data[col.field]) }}
        </template>
        <template #body="slotProps" v-else-if="col.field === 'file_size'">
          {{ formatFileSize(slotProps.data[col.field]) }}
        </template>
      </Column>

      <Column headerStyle="width: 8rem; text-align: center" bodyStyle="text-align: center; overflow: visible">
        <template #header>Actions</template>
        <template #body="slotProps">
          <div class="flex gap-2 justify-center items-center">
            <Button 
              type="button" 
              icon="pi pi-eye" 
              @click="slotProps.data.file_url ? window.open(slotProps.data.file_url, '_blank') : router.push({ name: 'view-document', params: { documentId: slotProps.data.id } })" 
              severity="secondary" 
              variant="text" 
              size="small"
              v-tooltip.top="'View'"
              class="text-primary-500 hover:bg-primary-100"
            />
            <Button 
              type="button" 
              icon="pi pi-pencil" 
              @click="router.push({ name: 'edit-document', params: { documentId: slotProps.data.id } })" 
              severity="secondary" 
              variant="text" 
              size="small"
              v-tooltip.top="'Edit'"
              class="text-primary-500 hover:bg-primary-100"
            />
            <Button 
              type="button" 
              icon="pi pi-trash" 
              @click="deleteDocument(slotProps.data)" 
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

  <Dialog v-model:visible="showAddDialog" :style="{width: '450px'}" header="Document Details" :modal="true" class="p-fluid">
    <div class="field">
      <label for="document_name">Document Name</label>
      <InputText id="document_name" v-model.trim="document.document_name" required="true" autofocus :class="{'p-invalid': submitted && !document.document_name}" />
      <small class="p-error" v-if="submitted && !document.document_name">Document name is required.</small>
    </div>
    <div class="field">
      <label for="document_type">Document Type</label>
      <Dropdown id="document_type" v-model="document.document_type" :options="documentTypeOptions" optionLabel="name" placeholder="Select" :class="{'p-invalid': submitted && !document.document_type}" />
      <small class="p-error" v-if="submitted && !document.document_type">Document type is required.</small>
    </div>
    <div class="field">
      <label for="file">Upload File</label>
      <input type="file" id="file" @change="handleFileChange" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
      <small v-if="selectedFile">Selected: {{ selectedFile.name }}</small>
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
      <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveDocument" />
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
import { MultiSelect, Button, IconField, InputIcon, InputText, Dialog, Dropdown, ConfirmDialog, Toast } from 'primevue'
import Tooltip from 'primevue/tooltip'
import { useConfirm } from 'primevue/useconfirm'
import { documentsAPI } from '@/api/documents'

const toast = useToast()
const confirm = useConfirm()
const router = useRouter()
const route = useRoute()

const documents = ref([])
const selectedDocuments = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const dt = ref()
const showAddDialog = ref(false)
const submitted = ref(false)
const editingItem = ref(null)
const selectedFile = ref(null)
const first = ref(0)
const rows = ref(10)
const sortField = ref('created_at')
const sortOrder = ref(-1)

const document = ref({
  document_name: '',
  document_type: '',
  application_type: 'none',
  description: ''
})

const documentTypeOptions = ref([
  { name: 'Resume', value: 'resume' },
  { name: 'CV', value: 'cv' },
  { name: 'Cover Letter', value: 'cover_letter' },
  { name: 'Transcript', value: 'transcript' },
  { name: 'Recommendation Letter', value: 'recommendation_letter' },
  { name: 'Portfolio', value: 'portfolio' },
  { name: 'Certificate', value: 'certificate' },
  { name: 'Other', value: 'other' }
])

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const tableColumns = ref([
  { field: 'document_name', header: 'Document Name', sortable: true, filter: true },
  { field: 'document_type', header: 'Type', sortable: true, filter: true },
  { field: 'application_type', header: 'Application Type', sortable: true, filter: true },
  { field: 'file_format', header: 'Format', sortable: true, filter: true },
  { field: 'file_size', header: 'Size', sortable: true },
  { field: 'created_at', header: 'Uploaded', type: 'date', sortable: true }
])

const selectedColumns = ref([])

const onToggle = (val) => {
  selectedColumns.value = val
}


const fetchDocuments = async (params = {}) => {
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
    
    const response = await documentsAPI.getDocuments(queryParams)
    
    if (response && response.data) {
      const items = response.data.items || []
      documents.value = items.length > 0 ? JSON.parse(JSON.stringify(items)) : []
      totalRecords.value = response.data.total || 0
    } else {
      documents.value = []
      totalRecords.value = 0
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch documents',
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
  await fetchDocuments({
    page: page,
    limit: event.rows
  })
}

const onSort = async (event) => {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder
  first.value = 0
  await fetchDocuments({
    page: 1,
    limit: rows.value,
    sort_by: event.sortField,
    sort_order: event.sortOrder === 1 ? 'asc' : 'desc'
  })
}

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
}

const saveDocument = async () => {
  submitted.value = true
  if (!document.value.document_name || !document.value.document_type) {
    return
  }

  if (!editingItem.value && !selectedFile.value) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file to upload', life: 3000 })
    return
  }

  try {
    if (editingItem.value) {
      await documentsAPI.updateDocument(editingItem.value.id, document.value)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Document updated', life: 3000 })
    } else {
      await documentsAPI.uploadDocument(selectedFile.value, document.value)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Document uploaded', life: 3000 })
    }
    hideDialog()
    await fetchDocuments({ page: 1, limit: rows.value })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save document', life: 5000 })
  }
}

const deleteDocument = async (documentItem) => {
  confirm.require({
    message: 'Are you sure you want to delete this document?',
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await documentsAPI.deleteDocument(documentItem.id)
        await fetchDocuments({ page: 1, limit: rows.value })
        toast.add({ severity: 'success', summary: 'Success', detail: 'Document deleted', life: 3000 })
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete document', life: 5000 })
      }
    }
  })
}

const hideDialog = () => {
  showAddDialog.value = false
  submitted.value = false
  editingItem.value = null
  selectedFile.value = null
  document.value = {
    document_name: '',
    document_type: '',
    application_type: 'none',
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

const formatFileSize = (bytes) => {
  if (!bytes) return '-'
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}


watch(() => filters.value.global?.value, (newVal) => {
  if (newVal !== null) {
    first.value = 0
    fetchDocuments({ page: 1, limit: rows.value })
  }
}, { debounce: 300 })

onMounted(() => {
  selectedColumns.value = [...tableColumns.value]
  fetchDocuments({ page: 1, limit: rows.value })
})
</script>

