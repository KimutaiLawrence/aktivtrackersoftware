import api from './axios'

export const analyticsAPI = {
  // Get dashboard analytics
  getDashboardAnalytics() {
    return api.get('/api/v1/analytics/dashboard')
  },

  // Get application timeline
  getApplicationTimeline(params = {}) {
    return api.get('/api/v1/analytics/timeline', { params })
  },

  // Get productivity metrics
  getProductivityMetrics(params = {}) {
    return api.get('/api/v1/analytics/productivity', { params })
  }
}
