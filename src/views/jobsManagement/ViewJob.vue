<template>
  <div class="rounded-md bg-white shadow-sm px-2 pb-0.5 border border-gray-50 mb-2">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-base font-semibold text-primary-500 capitalize">Job Application Details</h1>
        <p class="text-sm font-extralight leading-tight">View job application information</p>
      </div>
      <Button 
        icon="pi pi-arrow-left" 
        label="Back" 
        @click="router.push({ name: 'jobs' })"
        size="small"
        class="bg-primary-500 text-white"
      />
    </div>
  </div>

  <div v-if="loading" class="flex items-center justify-center p-8">
    <i class="pi pi-spin pi-spinner text-2xl"></i>
  </div>

  <div v-else-if="job" class="bg-white rounded-md shadow-sm">
    <Tabs v-model:activeIndex="activeTab">
      <TabList>
        <Tab>Overview</Tab>
        <Tab>Details</Tab>
        <Tab>Additional Info</Tab>
        <Tab>Steps</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="text-sm font-medium text-foreground-muted">Job Title</label>
                <p class="text-sm text-foreground mt-1 font-medium">{{ job.job_title }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-foreground-muted">Company</label>
                <p class="text-sm text-foreground mt-1 font-medium">{{ job.company_name }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-foreground-muted">Status</label>
                <Tag :value="job.status" :severity="getStatusSeverity(job.status)" class="mt-1" />
              </div>
              <div>
                <label class="text-sm font-medium text-foreground-muted">Priority</label>
                <p class="text-sm text-foreground mt-1">{{ job.priority }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-foreground-muted">Job Type</label>
                <p class="text-sm text-foreground mt-1">{{ job.job_type }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-foreground-muted">Location</label>
                <p class="text-sm text-foreground mt-1">{{ job.location || '-' }}</p>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-if="job.applied_date">
                <label class="text-sm font-medium text-foreground-muted">Applied Date</label>
                <p class="text-sm text-foreground mt-1">{{ formatDate(job.applied_date) }}</p>
              </div>
              <div v-if="job.deadline">
                <label class="text-sm font-medium text-foreground-muted">Deadline</label>
                <p class="text-sm text-foreground mt-1">{{ formatDate(job.deadline) }}</p>
              </div>
              <div v-if="job.interview_date">
                <label class="text-sm font-medium text-foreground-muted">Interview Date</label>
                <p class="text-sm text-foreground mt-1">{{ formatDate(job.interview_date) }}</p>
              </div>
              <div v-if="job.offer_date">
                <label class="text-sm font-medium text-foreground-muted">Offer Date</label>
                <p class="text-sm text-foreground mt-1">{{ formatDate(job.offer_date) }}</p>
              </div>
              <div v-if="job.job_url" class="md:col-span-2">
                <label class="text-sm font-medium text-foreground-muted">Job URL</label>
                <a :href="job.job_url" target="_blank" class="text-sm text-primary-500 hover:underline mt-1 block">{{ job.job_url }}</a>
              </div>
              <div v-if="job.job_description" class="md:col-span-2">
                <label class="text-sm font-medium text-foreground-muted">Description</label>
                <p class="text-sm text-foreground mt-1 whitespace-pre-wrap">{{ job.job_description }}</p>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div class="p-6">
            <div v-if="job.notes" class="mb-6">
              <label class="text-sm font-medium text-foreground-muted">Notes</label>
              <p class="text-sm text-foreground mt-1 whitespace-pre-wrap">{{ job.notes }}</p>
            </div>
            <div v-if="job.contact_person || job.contact_email || job.contact_phone" class="mb-6">
              <h4 class="text-sm font-semibold text-foreground mb-3">Contact Information</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-if="job.contact_person">
                  <label class="text-sm font-medium text-foreground-muted">Contact Person</label>
                  <p class="text-sm text-foreground mt-1">{{ job.contact_person }}</p>
                </div>
                <div v-if="job.contact_email">
                  <label class="text-sm font-medium text-foreground-muted">Contact Email</label>
                  <p class="text-sm text-foreground mt-1">{{ job.contact_email }}</p>
                </div>
                <div v-if="job.contact_phone">
                  <label class="text-sm font-medium text-foreground-muted">Contact Phone</label>
                  <p class="text-sm text-foreground mt-1">{{ job.contact_phone }}</p>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <Button 
                icon="pi pi-id-card" 
                label="Tailor my CV" 
                @click="tailorCv"
                size="small"
                severity="secondary"
                v-tooltip.top="'Open RevampYourCV with this job and save the CV back here'"
              />
              <Button 
                icon="pi pi-pencil" 
                label="Edit" 
                @click="router.push({ name: 'edit-job', params: { jobId: job.id } })"
                size="small"
                class="bg-primary-500 text-white"
              />
              <Button 
                icon="pi pi-trash" 
                label="Delete" 
                @click="deleteJob"
                size="small"
                severity="danger"
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div class="p-6">
            <div class="mb-6">
              <label class="text-sm font-medium text-foreground-muted">Where the job link came from</label>
              <a v-if="timeline.source_url || job.job_url" :href="timeline.source_url || job.job_url" target="_blank" class="text-sm text-primary-500 hover:underline mt-1 block break-all">{{ timeline.source_url || job.job_url }}</a>
              <p v-else class="text-sm text-foreground mt-1">No link saved</p>
              <p v-if="job.source" class="text-xs text-foreground-muted mt-1">Source: {{ job.source }}</p>
            </div>
            <h4 class="text-sm font-semibold text-foreground mb-3">Steps taken</h4>
            <p v-if="!timeline.events.length" class="text-sm text-foreground-muted">No steps recorded yet.</p>
            <ol v-else class="space-y-4">
              <li v-for="e in timeline.events" :key="e.id" class="border-l-2 border-primary-500 pl-4">
                <p class="text-sm font-medium text-foreground">{{ e.title }}</p>
                <p v-if="e.notes" class="text-sm text-foreground mt-1 whitespace-pre-wrap">{{ e.notes }}</p>
                <a v-if="e.additional_data && e.additional_data.startsWith('http')" :href="e.additional_data" target="_blank" class="text-xs text-primary-500 hover:underline break-all">{{ e.additional_data }}</a>
                <p class="text-xs text-foreground-muted mt-1">{{ new Date(e.created_at).toLocaleString() }} · {{ e.changed_by }}</p>
              </li>
            </ol>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>

  <ConfirmDialog></ConfirmDialog>
  <Toast />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { Button, Tag, ConfirmDialog, Toast, Tabs, TabList, Tab, TabPanels, TabPanel } from 'primevue'
import { jobsAPI } from '@/api/jobs'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const confirm = useConfirm()

const job = ref(null)
const loading = ref(false)
const activeTab = ref(0)
const timeline = ref({ source_url: null, events: [] })

const fetchJob = async () => {
  try {
    loading.value = true
    const response = await jobsAPI.getJobApplication(route.params.jobId)
    job.value = response.data
    try {
      const t = await jobsAPI.getJobTimeline(route.params.jobId)
      timeline.value = t.data
    } catch (e) {
      timeline.value = { source_url: null, events: [] }
    }
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

// Opens synchronously (so popup blockers allow it); the new tab mints the sign-in link
const tailorCv = () => {
  const { href } = router.resolve({ name: 'cv-builder', query: { job: job.value.id } })
  window.open(href, '_blank', 'noopener')
}

const deleteJob = () => {
  confirm.require({
    message: 'Are you sure you want to delete this job application?',
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await jobsAPI.deleteJobApplication(job.value.id)
        toast.add({ severity: 'success', summary: 'Success', detail: 'Job application deleted', life: 3000 })
        router.push({ name: 'jobs' })
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete job application', life: 5000 })
      }
    }
  })
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
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

onMounted(() => {
  fetchJob()
})
</script>

