import api from './axios'

export const preferencesAPI = {
  async getPreferences() {
    const response = await api.get('/api/v1/preferences/')
    return response
  },

  async updatePreferences(data) {
    const response = await api.put('/api/v1/preferences/', data)
    return response
  }
}

