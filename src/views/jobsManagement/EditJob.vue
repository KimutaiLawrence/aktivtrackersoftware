<template>
  <div class="rounded-md bg-white shadow-sm px-2 pb-0.5 border border-gray-50 mb-2">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-base font-semibold text-primary-500 capitalize">Edit Job Application</h1>
        <p class="text-sm font-extralight leading-tight">Update job application information</p>
      </div>
      <Button 
        icon="pi pi-arrow-left" 
        label="Back" 
        @click="router.push({ name: 'view-job', params: { jobId: route.params.jobId } })"
        size="small"
        class="bg-primary-500 text-white"
      />
    </div>
  </div>

  <div v-if="loading" class="flex items-center justify-center p-8">
    <i class="pi pi-spin pi-spinner text-2xl"></i>
  </div>

  <div v-else-if="formData" class="bg-white rounded-md shadow-sm">
    <Tabs v-model:activeIndex="activeTab">
      <TabList>
        <Tab>Basic Information</Tab>
        <Tab>Status & Dates</Tab>
        <Tab>Additional Details</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="field">
                <label for="job_title" class="text-sm font-medium">
                  Job Title <span class="text-red-500">*</span>
                </label>
                <InputText 
                  id="job_title"
                  v-model="formData.job_title"
                  placeholder="e.g., Software Engineer"
                  class="w-full mt-1"
                />
              </div>
              <div class="field">
                <label for="company_name" class="text-sm font-medium">
                  Company Name <span class="text-red-500">*</span>
                </label>
                <InputText 
                  id="company_name"
                  v-model="formData.company_name"
                  placeholder="e.g., Tech Corp"
                  class="w-full mt-1"
                />
              </div>
              <div class="field">
                <label for="location" class="text-sm font-medium">
                  Location <span class="text-red-500">*</span>
                </label>
                <InputText 
                  id="location"
                  v-model="formData.location"
                  placeholder="e.g., New York, NY"
                  class="w-full mt-1"
                />
              </div>
              <div class="field">
                <label for="job_type" class="text-sm font-medium">
                  Job Type <span class="text-red-500">*</span>
                </label>
                <Dropdown 
                  id="job_type"
                  v-model="formData.job_type"
                  :options="['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']"
                  placeholder="Select job type"
                  class="w-full mt-1"
                />
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div class="field">
                <label for="status" class="text-sm font-medium">
                  Status <span class="text-red-500">*</span>
                </label>
                <Dropdown 
                  id="status"
                  v-model="formData.status"
                  :options="['Applied', 'Interview', 'Offer', 'Rejected', 'Pending']"
                  placeholder="Select status"
                  class="w-full mt-1"
                />
              </div>
              <div class="field">
                <label for="priority" class="text-sm font-medium">
                  Priority <span class="text-red-500">*</span>
                </label>
                <Dropdown 
                  id="priority"
                  v-model="formData.priority"
                  :options="['High', 'Medium', 'Low']"
                  placeholder="Select priority"
                  class="w-full mt-1"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="field">
                <label for="applied_date" class="text-sm font-medium">
                  Applied Date <span class="text-red-500">*</span>
                </label>
                <Calendar 
                  id="applied_date"
                  v-model="formData.applied_date"
                  placeholder="Select date"
                  dateFormat="yy-mm-dd"
                  class="w-full mt-1"
                />
              </div>
              <div class="field">
                <label for="deadline" class="text-sm font-medium">
                  Deadline <span class="text-gray-400 text-xs">(Optional)</span>
                </label>
                <Calendar 
                  id="deadline"
                  v-model="formData.deadline"
                  placeholder="Select deadline (optional)"
                  dateFormat="yy-mm-dd"
                  class="w-full mt-1"
                />
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div class="p-6">
            <div class="field">
              <label for="notes" class="text-sm font-medium">
                Notes <span class="text-gray-400 text-xs">(Optional)</span>
              </label>
              <Textarea 
                id="notes"
                v-model="formData.notes"
                placeholder="Enter any additional notes or comments..."
                :rows="6"
                class="w-full mt-1"
              />
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
    
    <div class="p-6 border-t border-gray-200 flex gap-2 justify-end">
      <Button 
        label="Cancel" 
        icon="pi pi-times" 
        @click="router.push({ name: 'view-job', params: { jobId: route.params.jobId } })"
        class="p-button-text"
        size="small"
      />
      <Button 
        label="Save Changes" 
        icon="pi pi-check" 
        @click="saveJob"
        :loading="saving"
        class="bg-primary-500 text-white"
        size="small"
      />
    </div>
  </div>

  <Toast />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { Button, InputText, Textarea, Dropdown, Calendar, Toast, Tabs, TabList, Tab, TabPanels, TabPanel } from 'primevue'
import { jobsAPI } from '@/api/jobs'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const formData = ref({})
const loading = ref(false)
const saving = ref(false)
const activeTab = ref(0)

const fetchJob = async () => {
  try {
    loading.value = true
    const response = await jobsAPI.getJobApplication(route.params.jobId)
    formData.value = { ...response.data }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch job application',
      life: 3000
    })
    router.push({ name: 'jobs' })
  } finally {
    loading.value = false
  }
}

const saveJob = async () => {
  try {
    saving.value = true
    await jobsAPI.updateJobApplication(route.params.jobId, formData.value)
    toast.add({ severity: 'success', summary: 'Success', detail: 'Job application updated', life: 3000 })
    router.push({ name: 'view-job', params: { jobId: route.params.jobId } })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update job application', life: 5000 })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchJob()
})
</script>

