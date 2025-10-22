import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { scholarshipsAPI } from '../api'

export const useScholarshipsStore = defineStore('scholarships', () => {
  // State
  const scholarships = ref([])
  const currentScholarship = ref(null)
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
  const scholarshipsList = computed(() => scholarships.value)
  const totalScholarships = computed(() => pagination.value.total)

  // Actions
  async function fetchScholarships(params = {}) {
    try {
      loading.value = true
      error.value = null
      const response = await scholarshipsAPI.getScholarshipApplications(params)

      scholarships.value = response.data.items
      pagination.value = {
        total: response.data.total,
        skip: response.data.skip,
        limit: response.data.limit,
        has_more: response.data.has_more
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to fetch scholarship applications'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchScholarshipById(id) {
    try {
      loading.value = true
      error.value = null
      const response = await scholarshipsAPI.getScholarshipApplication(id)
      currentScholarship.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to fetch scholarship application'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createScholarship(data) {
    try {
      loading.value = true
      error.value = null
      const response = await scholarshipsAPI.createScholarshipApplication(data)
      scholarships.value.unshift(response.data)
      pagination.value.total++
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to create scholarship application'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateScholarship(id, data) {
    try {
      loading.value = true
      error.value = null
      const response = await scholarshipsAPI.updateScholarshipApplication(id, data)

      const index = scholarships.value.findIndex(scholarship => scholarship.id === id)
      if (index !== -1) {
        scholarships.value[index] = response.data
      }

      if (currentScholarship.value?.id === id) {
        currentScholarship.value = response.data
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to update scholarship application'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteScholarship(id) {
    try {
      loading.value = true
      error.value = null
      await scholarshipsAPI.deleteScholarshipApplication(id)

      const index = scholarships.value.findIndex(scholarship => scholarship.id === id)
      if (index !== -1) {
        scholarships.value.splice(index, 1)
        pagination.value.total--
      }

      if (currentScholarship.value?.id === id) {
        currentScholarship.value = null
      }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to delete scholarship application'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateScholarshipStatus(id, status) {
    try {
      loading.value = true
      error.value = null
      const response = await scholarshipsAPI.updateScholarshipApplicationStatus(id, status)

      const index = scholarships.value.findIndex(scholarship => scholarship.id === id)
      if (index !== -1) {
        scholarships.value[index] = response.data
      }

      if (currentScholarship.value?.id === id) {
        currentScholarship.value = response.data
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to update scholarship status'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchScholarshipStats() {
    try {
      const response = await scholarshipsAPI.getScholarshipApplicationStats()
      stats.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to fetch scholarship stats'
      throw err
    }
  }

  return {
    // State
    scholarships,
    currentScholarship,
    stats,
    loading,
    error,
    pagination,
    // Getters
    scholarshipsList,
    totalScholarships,
    // Actions
    fetchScholarships,
    fetchScholarshipById,
    createScholarship,
    updateScholarship,
    deleteScholarship,
    updateScholarshipStatus,
    fetchScholarshipStats,
  }
})
