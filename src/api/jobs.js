import api from './axios'

export const jobsAPI = {
  // Get all job applications
  getJobApplications(params = {}) {
    return api.get('/api/v1/jobs/', { params })
  },

  // Create job application
  createJobApplication(data) {
    return api.post('/api/v1/jobs/', data)
  },

  // Get job application by ID
  getJobApplication(applicationId) {
    return api.get(`/api/v1/jobs/${applicationId}`)
  },

  // Update job application
  updateJobApplication(applicationId, data) {
    return api.put(`/api/v1/jobs/${applicationId}`, data)
  },

  // Delete job application
  deleteJobApplication(applicationId) {
    return api.delete(`/api/v1/jobs/${applicationId}`)
  },

  // Update job application status
  updateJobApplicationStatus(applicationId, status) {
    return api.patch(`/api/v1/jobs/${applicationId}/status`, { status })
  },

  // Get job application stats
  getJobApplicationStats() {
    return api.get('/api/v1/jobs/stats/summary')
  },
}
