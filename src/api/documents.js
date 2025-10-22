import api from './axios'

export const documentsAPI = {
  // Get all documents
  getDocuments(params = {}) {
    return api.get('/api/v1/documents/', { params })
  },

  // Upload document
  uploadDocument(file, data = {}) {
    const formData = new FormData()
    formData.append('file', file)

    // Append additional data if provided
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })

    return api.post('/api/v1/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Get document by ID
  getDocument(documentId) {
    return api.get(`/api/v1/documents/${documentId}`)
  },

  // Update document
  updateDocument(documentId, data) {
    return api.put(`/api/v1/documents/${documentId}`, data)
  },

  // Delete document
  deleteDocument(documentId) {
    return api.delete(`/api/v1/documents/${documentId}`)
  },

  // Get document stats
  getDocumentStats() {
    return api.get('/api/v1/documents/stats/summary')
  },
}
