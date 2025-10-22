<template>
  <MainLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Documents</h1>
        <Button label="Upload Document" icon="pi pi-upload" @click="$refs.fileInput.click()" />
      </div>

      <input type="file" ref="fileInput" @change="handleFileUpload" class="hidden" />

      <Card>
        <template #content>
          <DataTable :value="documents" :loading="loading" :paginator="true" :rows="10">
            <Column field="document_name" header="Name" :sortable="true">
              <template #body="slotProps">
                <div class="flex items-center gap-2">
                  <i class="pi pi-file text-xl"></i>
                  <span>{{ slotProps.data.document_name }}</span>
                </div>
              </template>
            </Column>
            <Column field="document_type" header="Type" :sortable="true">
              <template #body="slotProps">
                <Tag :value="slotProps.data.document_type" />
              </template>
            </Column>
            <Column field="file_size" header="Size" :sortable="true">
              <template #body="slotProps">
                {{ formatFileSize(slotProps.data.file_size) }}
              </template>
            </Column>
            <Column field="created_at" header="Uploaded" :sortable="true">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.created_at) }}
              </template>
            </Column>
            <Column header="Actions">
              <template #body="slotProps">
                <div class="flex gap-2">
                  <Button icon="pi pi-download" rounded text @click="download(slotProps.data)" />
                  <Button icon="pi pi-trash" rounded text severity="danger" @click="deleteDoc(slotProps.data.id)" />
                </div>
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
import { useToast } from 'primevue/usetoast'
import { documentsAPI } from '../api'
import MainLayout from '../layouts/MainLayout.vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'

const toast = useToast()
const documents = ref([])
const loading = ref(false)

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    loading.value = true
    await documentsAPI.uploadDocument(file)
    toast.add({ severity: 'success', summary: 'Success', detail: 'Document uploaded', life: 3000 })
    fetchDocuments()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Upload failed', life: 5000 })
  } finally {
    loading.value = false
  }
}

const fetchDocuments = async () => {
  try {
    loading.value = true
    const response = await documentsAPI.getDocuments()
    documents.value = response.data.items || []
  } catch (error) {
    console.error('Failed to fetch documents:', error)
  } finally {
    loading.value = false
  }
}

const download = (doc) => {
  if (doc.file_url) {
    window.open(doc.file_url, '_blank')
  }
}

const deleteDoc = async (id) => {
  try {
    await documentsAPI.deleteDocument(id)
    toast.add({ severity: 'success', summary: 'Success', detail: 'Document deleted', life: 3000 })
    fetchDocuments()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Delete failed', life: 5000 })
  }
}

const formatFileSize = (bytes) => {
  if (!bytes) return 'N/A'
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

onMounted(() => fetchDocuments())
</script>
