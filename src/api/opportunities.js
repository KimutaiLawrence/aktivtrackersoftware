import api from './axios'

export const opportunitiesAPI = {
  // Get all opportunities
  getOpportunities(params = {}) {
    return api.get('/api/v1/opportunities/', { params })
  },

  // Create opportunity
  createOpportunity(data) {
    return api.post('/api/v1/opportunities/', data)
  },

  // Get opportunity by ID
  getOpportunity(opportunityId) {
    return api.get(`/api/v1/opportunities/${opportunityId}`)
  },

  // Update opportunity
  updateOpportunity(opportunityId, data) {
    return api.put(`/api/v1/opportunities/${opportunityId}`, data)
  },

  // Delete opportunity
  deleteOpportunity(opportunityId) {
    return api.delete(`/api/v1/opportunities/${opportunityId}`)
  },

  // Toggle opportunity status
  toggleOpportunityStatus(opportunityId) {
    return api.patch(`/api/v1/opportunities/${opportunityId}/toggle`)
  },

  // Get opportunity stats
  getOpportunityStats() {
    return api.get('/api/v1/opportunities/stats/summary')
  },
}
