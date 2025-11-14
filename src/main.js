import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Tooltip from 'primevue/tooltip'
import Ripple from 'primevue/ripple'
import StyleClass from 'primevue/styleclass'

import './style.css'
import 'primeicons/primeicons.css'

import App from './App.vue'
import router from './router'
import { usePreferencesStore } from './stores/preferences'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Load user preferences on app start
const preferencesStore = usePreferencesStore()
preferencesStore.loadPreferences().then(() => {
  preferencesStore.applyFontFamily()
})
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark-mode',
      cssLayer: false
    }
  },
  ripple: true
})
app.use(ToastService)
app.use(ConfirmationService)
app.directive('tooltip', Tooltip)
app.directive('ripple', Ripple)
app.directive('styleclass', StyleClass)

app.mount('#app')
