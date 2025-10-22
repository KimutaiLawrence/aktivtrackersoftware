import api from './axios'

export const activitiesAPI = {
  // Get all activities
  getActivities(params = {}) {
    return api.get('/api/v1/activities/', { params })
  },

  // Create activity
  createActivity(data) {
    return api.post('/api/v1/activities/', data)
  },

  // Get activity by ID
  getActivity(activityId) {
    return api.get(`/api/v1/activities/${activityId}`)
  },

  // Update activity
  updateActivity(activityId, data) {
    return api.put(`/api/v1/activities/${activityId}`, data)
  },

  // Delete activity
  deleteActivity(activityId) {
    return api.delete(`/api/v1/activities/${activityId}`)
  },

  // Update activity status
  updateActivityStatus(activityId, status) {
    return api.patch(`/api/v1/activities/${activityId}/status`, { status })
  },

  // Get activity stats
  getActivityStats() {
    return api.get('/api/v1/activities/stats/summary')
  },
}
