import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jobsAPI } from '../api'

export const useJobsStore = defineStore('jobs', () => {
  // State
  const jobs = ref([])
  const currentJob = ref(null)
  const stats = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    total: 0,
    skip: 0,
    limit: 10,
    has_more: false
  })

  // Getters
  const jobsList = computed(() => jobs.value)
  const totalJobs = computed(() => pagination.value.total)

  // Actions
  async function fetchJobs(params = {}) {
    try {
      loading.value = true
      error.value = null
      const response = await jobsAPI.getJobApplications(params)

      jobs.value = response.data.items
      pagination.value = {
        total: response.data.total,
        skip: response.data.skip,
        limit: response.data.limit,
        has_more: response.data.has_more
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to fetch job applications'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchJobById(id) {
    try {
      loading.value = true
      error.value = null
      const response = await jobsAPI.getJobApplication(id)
      currentJob.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to fetch job application'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createJob(data) {
    try {
      loading.value = true
      error.value = null
      const response = await jobsAPI.createJobApplication(data)
      jobs.value.unshift(response.data)
      pagination.value.total++
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to create job application'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateJob(id, data) {
    try {
      loading.value = true
      error.value = null
      const response = await jobsAPI.updateJobApplication(id, data)

      const index = jobs.value.findIndex(job => job.id === id)
      if (index !== -1) {
        jobs.value[index] = response.data
      }

      if (currentJob.value?.id === id) {
        currentJob.value = response.data
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to update job application'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteJob(id) {
    try {
      loading.value = true
      error.value = null
      await jobsAPI.deleteJobApplication(id)

      const index = jobs.value.findIndex(job => job.id === id)
      if (index !== -1) {
        jobs.value.splice(index, 1)
        pagination.value.total--
      }

      if (currentJob.value?.id === id) {
        currentJob.value = null
      }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to delete job application'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateJobStatus(id, status) {
    try {
      loading.value = true
      error.value = null
      const response = await jobsAPI.updateJobApplicationStatus(id, status)

      const index = jobs.value.findIndex(job => job.id === id)
      if (index !== -1) {
        jobs.value[index] = response.data
      }

      if (currentJob.value?.id === id) {
        currentJob.value = response.data
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to update job status'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchJobStats() {
    try {
      const response = await jobsAPI.getJobApplicationStats()
      stats.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to fetch job stats'
      throw err
    }
  }

  return {
    // State
    jobs,
    currentJob,
    stats,
    loading,
    error,
    pagination,
    // Getters
    jobsList,
    totalJobs,
    // Actions
    fetchJobs,
    fetchJobById,
    createJob,
    updateJob,
    deleteJob,
    updateJobStatus,
    fetchJobStats,
  }
})
