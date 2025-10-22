<template>
  <MainLayout>
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Scholarship Applications</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Track your scholarship opportunities</p>
        </div>
        <Button label="Add Scholarship" icon="pi pi-plus" @click="showCreateDialog" />
      </div>

      <Card>
        <template #content>
          <DataTable
            :value="scholarshipsStore.scholarships"
            :loading="scholarshipsStore.loading"
            :paginator="true"
            :rows="10"
            responsiveLayout="scroll"
          >
            <template #empty>
              <div class="text-center py-8">
                <i class="pi pi-inbox text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600 dark:text-gray-400">No scholarship applications found</p>
              </div>
            </template>

            <Column field="program_name" header="Program" :sortable="true">
              <template #body="slotProps">
                <div class="font-medium text-gray-900 dark:text-white">{{ slotProps.data.program_name }}</div>
                <div class="text-sm text-gray-500">{{ slotProps.data.institution }}</div>
              </template>
            </Column>

            <Column field="degree_level" header="Degree Level" :sortable="true">
              <template #body="slotProps">
                <Tag :value="slotProps.data.degree_level" />
              </template>
            </Column>

            <Column field="status" header="Status" :sortable="true">
              <template #body="slotProps">
                <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
              </template>
            </Column>

            <Column field="submission_deadline" header="Deadline" :sortable="true">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.submission_deadline) }}
              </template>
            </Column>

            <Column header="Actions">
              <template #body="slotProps">
                <div class="flex gap-2">
                  <Button icon="pi pi-pencil" rounded text @click="editScholarship(slotProps.data)" />
                  <Button icon="pi pi-trash" rounded text severity="danger" @click="confirmDelete(slotProps.data)" />
                </div>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>

    <Dialog v-model:visible="dialogVisible" :header="isEditing ? 'Edit Scholarship' : 'Add Scholarship'" :modal="true" :style="{ width: '50rem' }">
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium">Program Name *</label>
            <InputText v-model="formData.program_name" placeholder="e.g. Graduate Fellowship" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium">Institution *</label>
            <InputText v-model="formData.institution" placeholder="e.g. MIT" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium">Degree Level</label>
            <Dropdown v-model="formData.degree_level" :options="degreeLevelOptions" placeholder="Select degree" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium">Field of Study</label>
            <InputText v-model="formData.field_of_study" placeholder="e.g. Computer Science" />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium">Notes</label>
          <Textarea v-model="formData.notes" rows="4" />
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" text @click="dialogVisible = false" />
        <Button :label="isEditing ? 'Update' : 'Create'" :loading="saving" @click="saveScholarship" />
      </template>
    </Dialog>

    <ConfirmDialog />
  </MainLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useScholarshipsStore } from '../stores/scholarships'
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

const toast = useToast()
const confirm = useConfirm()
const scholarshipsStore = useScholarshipsStore()

const dialogVisible = ref(false)
const isEditing = ref(false)
const saving = ref(false)

const formData = reactive({
  program_name: '',
  institution: '',
  degree_level: 'masters',
  field_of_study: '',
  notes: ''
})

const degreeLevelOptions = ['bachelors', 'masters', 'phd', 'postdoc', 'diploma', 'certificate']

const getStatusSeverity = (status) => {
  const map = {
    not_started: 'info',
    in_progress: 'warning',
    submitted: 'primary',
    accepted: 'success',
    rejected: 'danger'
  }
  return map[status] || 'info'
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

const editScholarship = (scholarship) => {
  isEditing.value = true
  Object.assign(formData, scholarship)
  dialogVisible.value = true
}

const resetForm = () => {
  formData.program_name = ''
  formData.institution = ''
  formData.degree_level = 'masters'
  formData.field_of_study = ''
  formData.notes = ''
}

const saveScholarship = async () => {
  try {
    saving.value = true
    if (isEditing.value) {
      await scholarshipsStore.updateScholarship(formData.id, formData)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Scholarship updated', life: 3000 })
    } else {
      await scholarshipsStore.createScholarship(formData)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Scholarship created', life: 3000 })
    }
    dialogVisible.value = false
    resetForm()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save scholarship', life: 5000 })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (scholarship) => {
  confirm.require({
    message: `Delete ${scholarship.program_name}?`,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteScholarship(scholarship.id)
  })
}

const deleteScholarship = async (id) => {
  try {
    await scholarshipsStore.deleteScholarship(id)
    toast.add({ severity: 'success', summary: 'Success', detail: 'Scholarship deleted', life: 3000 })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete', life: 5000 })
  }
}

onMounted(() => {
  scholarshipsStore.fetchScholarships()
})
</script>
