import api from './axios'

export const integrationsAPI = {
  // One-time sign-in link into RevampYourCV, optionally tailored to a job application
  revampYourCvHandoff(jobId = null) {
    return api.post('/api/v1/integrations/revampyourcv/handoff', jobId ? { job_id: jobId } : {})
  }
}
