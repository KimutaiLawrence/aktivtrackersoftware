import api from './axios'

export const scholarshipsAPI = {
  // Get all scholarship applications
  getScholarshipApplications(params = {}) {
    return api.get('/api/v1/scholarships/', { params })
  },

  // Create scholarship application
  createScholarshipApplication(data) {
    return api.post('/api/v1/scholarships/', data)
  },

  // Get scholarship application by ID
  getScholarshipApplication(applicationId) {
    return api.get(`/api/v1/scholarships/${applicationId}`)
  },

  // Update scholarship application
  updateScholarshipApplication(applicationId, data) {
    return api.put(`/api/v1/scholarships/${applicationId}`, data)
  },

  // Delete scholarship application
  deleteScholarshipApplication(applicationId) {
    return api.delete(`/api/v1/scholarships/${applicationId}`)
  },

  // Update scholarship application status
  updateScholarshipApplicationStatus(applicationId, status) {
    return api.patch(`/api/v1/scholarships/${applicationId}/status`, { status })
  },

  // Get scholarship application stats
  getScholarshipApplicationStats() {
    return api.get('/api/v1/scholarships/stats/summary')
  },
}
