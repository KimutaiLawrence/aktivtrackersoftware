import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { activitiesAPI } from '../api'

export const useActivitiesStore = defineStore('activities', () => {
  // State
  const activities = ref([])
  const currentActivity = ref(null)
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
  const activitiesList = computed(() => activities.value)
  const totalActivities = computed(() => pagination.value.total)

  // Actions
  async function fetchActivities(params = {}) {
    try {
      loading.value = true
      error.value = null
      const response = await activitiesAPI.getActivities(params)

      activities.value = response.data.items
      pagination.value = {
        total: response.data.total,
        skip: response.data.skip,
        limit: response.data.limit,
        has_more: response.data.has_more
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to fetch activities'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchActivityById(id) {
    try {
      loading.value = true
      error.value = null
      const response = await activitiesAPI.getActivity(id)
      currentActivity.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to fetch activity'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createActivity(data) {
    try {
      loading.value = true
      error.value = null
      const response = await activitiesAPI.createActivity(data)
      activities.value.unshift(response.data)
      pagination.value.total++
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to create activity'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateActivity(id, data) {
    try {
      loading.value = true
      error.value = null
      const response = await activitiesAPI.updateActivity(id, data)

      const index = activities.value.findIndex(activity => activity.id === id)
      if (index !== -1) {
        activities.value[index] = response.data
      }

      if (currentActivity.value?.id === id) {
        currentActivity.value = response.data
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to update activity'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteActivity(id) {
    try {
      loading.value = true
      error.value = null
      await activitiesAPI.deleteActivity(id)

      const index = activities.value.findIndex(activity => activity.id === id)
      if (index !== -1) {
        activities.value.splice(index, 1)
        pagination.value.total--
      }

      if (currentActivity.value?.id === id) {
        currentActivity.value = null
      }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to delete activity'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateActivityStatus(id, status) {
    try {
      loading.value = true
      error.value = null
      const response = await activitiesAPI.updateActivityStatus(id, status)

      const index = activities.value.findIndex(activity => activity.id === id)
      if (index !== -1) {
        activities.value[index] = response.data
      }

      if (currentActivity.value?.id === id) {
        currentActivity.value = response.data
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to update activity status'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchActivityStats() {
    try {
      const response = await activitiesAPI.getActivityStats()
      stats.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to fetch activity stats'
      throw err
    }
  }

  return {
    // State
    activities,
    currentActivity,
    stats,
    loading,
    error,
    pagination,
    // Getters
    activitiesList,
    totalActivities,
    // Actions
    fetchActivities,
    fetchActivityById,
    createActivity,
    updateActivity,
    deleteActivity,
    updateActivityStatus,
    fetchActivityStats,
  }
})
