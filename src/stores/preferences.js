import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { preferencesAPI } from '@/api/preferences'

export const usePreferencesStore = defineStore('preferences', () => {
  const fontFamily = ref('geist')
  const preferences = ref({})
  const loading = ref(false)

  const fontFamilyStack = computed(() => {
    switch (fontFamily.value) {
      case 'geist':
        return [
          '"Geist"',
          '"Geist Sans"',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ]
      case 'sf-pro':
        return [
          '"SF Pro Display"',
          '"SF Pro Text"',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ]
      case 'system':
        return [
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ]
      default:
        return [
          '"Geist"',
          '"Geist Sans"',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ]
    }
  })

  async function loadPreferences() {
    try {
      loading.value = true
      const response = await preferencesAPI.getPreferences()
      if (response && response.data) {
        fontFamily.value = response.data.font_family || 'geist'
        preferences.value = response.data.preferences || {}
        applyFontFamily()
      }
    } catch (error) {
      console.error('Failed to load preferences:', error)
    } finally {
      loading.value = false
    }
  }

  async function updateFontFamily(newFontFamily) {
    try {
      loading.value = true
      const response = await preferencesAPI.updatePreferences({
        font_family: newFontFamily
      })
      if (response && response.data) {
        fontFamily.value = response.data.font_family
        applyFontFamily()
      }
    } catch (error) {
      console.error('Failed to update font family:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updatePreferences(newPreferences) {
    try {
      loading.value = true
      const response = await preferencesAPI.updatePreferences({
        preferences: newPreferences
      })
      if (response && response.data) {
        preferences.value = response.data.preferences || {}
      }
    } catch (error) {
      console.error('Failed to update preferences:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  function applyFontFamily() {
    const root = document.documentElement
    const fontStack = fontFamilyStack.value.join(', ')
    root.style.setProperty('--font-family-sans', fontStack)
    root.style.fontFamily = fontStack
  }

  return {
    fontFamily,
    preferences,
    loading,
    fontFamilyStack,
    loadPreferences,
    updateFontFamily,
    updatePreferences,
    applyFontFamily
  }
})

