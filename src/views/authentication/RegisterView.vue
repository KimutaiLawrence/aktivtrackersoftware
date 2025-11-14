<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
    <div class="container">
      <!-- Left Section - Register Form -->
      <div class="login-form">
        <div class="header">
          <label class="title">Create an Account</label>
          <p class="description">Create your account in no time and start tracking your career journey.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
          <div class="input_container">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
              <InputText
              v-model="formData.full_name"
              type="text" 
              placeholder="Full Name" 
              fluid 
              class="input_field"
              :class="{ 'p-invalid': errors.full_name }"
            />
            <Message v-if="errors.full_name" severity="error" size="small" variant="simple" class="mt-1">
              {{ errors.full_name }}
            </Message>
            </div>

          <div class="input_container">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
              <InputText
              v-model="formData.username"
              type="text" 
              placeholder="Username" 
              fluid 
              class="input_field"
              :class="{ 'p-invalid': errors.username }"
            />
            <Message v-if="errors.username" severity="error" size="small" variant="simple" class="mt-1">
              {{ errors.username }}
            </Message>
            </div>

          <div class="input_container">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M7 8.5L9.94202 10.2394C11.6572 11.2535 12.3428 11.2535 14.058 10.2394L17 8.5" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round"></path>
            </svg>
              <InputText
              v-model="formData.email"
                type="email"
              placeholder="name@mail.com" 
              fluid 
              class="input_field"
              :class="{ 'p-invalid': errors.email }"
            />
            <Message v-if="errors.email" severity="error" size="small" variant="simple" class="mt-1">
              {{ errors.email }}
            </Message>
            </div>

          <div class="input_container">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 11.0041C17.4166 9.91704 16.273 9.15775 14.9519 9.0993C13.477 9.03404 11.9788 9 10.329 9C8.67911 9 7.18091 9.03404 5.70604 9.0993C3.95328 9.17685 2.51295 10.4881 2.27882 12.1618C2.12602 13.2541 2 14.3734 2 15.5134C2 16.6534 2.12602 17.7727 2.27882 18.865C2.51295 20.5387 3.95328 21.8499 5.70604 21.9275C6.42013 21.9591 7.26041 21.9834 8 22" stroke="#141B34" stroke-width="1.5" stroke-linecap="round"></path>
              <path d="M6 9V6.5C6 4.01472 8.01472 2 10.5 2C12.9853 2 15 4.01472 15 6.5V9" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M21.2046 15.1045L20.6242 15.6956V15.6956L21.2046 15.1045ZM21.4196 16.4767C21.7461 16.7972 22.2706 16.7924 22.5911 16.466C22.9116 16.1395 22.9068 15.615 22.5804 15.2945L21.4196 16.4767ZM18.0228 15.1045L17.4424 14.5134V14.5134L18.0228 15.1045ZM18.2379 18.0387C18.5643 18.3593 19.0888 18.3545 19.4094 18.028C19.7299 17.7016 19.7251 17.1771 19.3987 16.8565L18.2379 18.0387ZM14.2603 20.7619C13.7039 21.3082 12.7957 21.3082 12.2394 20.7619L11.0786 21.9441C12.2794 23.1232 14.2202 23.1232 15.4211 21.9441L14.2603 20.7619ZM12.2394 20.7619C11.6914 20.2239 11.6914 19.358 12.2394 18.82L11.0786 17.6378C9.86927 18.8252 9.86927 20.7567 11.0786 21.9441L12.2394 20.7619ZM12.2394 18.82C12.7957 18.2737 13.7039 18.2737 14.2603 18.82L15.4211 17.6378C14.2202 16.4587 12.2794 16.4587 11.0786 17.6378L12.2394 18.82ZM14.2603 18.82C14.8082 19.358 14.8082 20.2239 14.2603 20.7619L15.4211 21.9441C16.6304 20.7567 16.6304 18.8252 15.4211 17.6378L14.2603 18.82ZM20.6242 15.6956L21.4196 16.4767L22.5804 15.2945L21.785 14.5134L20.6242 15.6956ZM15.4211 18.82L17.8078 16.4767L16.647 15.2944L14.2603 17.6377L15.4211 18.82ZM17.8078 16.4767L18.6032 15.6956L17.4424 14.5134L16.647 15.2945L17.8078 16.4767ZM16.647 16.4767L18.2379 18.0387L19.3987 16.8565L17.8078 15.2945L16.647 16.4767ZM21.785 14.5134C21.4266 14.1616 21.0998 13.8383 20.7993 13.6131C20.4791 13.3732 20.096 13.1716 19.6137 13.1716V14.8284C19.6145 14.8284 19.619 14.8273 19.6395 14.8357C19.6663 14.8466 19.7183 14.8735 19.806 14.9391C19.9969 15.0822 20.2326 15.3112 20.6242 15.6956L21.785 14.5134ZM18.6032 15.6956C18.9948 15.3112 19.2305 15.0822 19.4215 14.9391C19.5091 14.8735 19.5611 14.8466 19.5879 14.8357C19.6084 14.8273 19.6129 14.8284 19.6137 14.8284V13.1716C19.1314 13.1716 18.7483 13.3732 18.4281 13.6131C18.1276 13.8383 17.8008 14.1616 17.4424 14.5134L18.6032 15.6956Z" fill="#141B34"></path>
            </svg>
            <InputText 
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Password" 
              fluid 
              class="input_field"
              :class="{ 'p-invalid': errors.password }"
            />
            <button 
              type="button" 
              @click="togglePasswordVisibility" 
              class="eye-icon"
            >
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
            <Message v-if="errors.password" severity="error" size="small" variant="simple" class="mt-1">
              {{ errors.password }}
            </Message>
            </div>

          <div class="input_container">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 11.0041C17.4166 9.91704 16.273 9.15775 14.9519 9.0993C13.477 9.03404 11.9788 9 10.329 9C8.67911 9 7.18091 9.03404 5.70604 9.0993C3.95328 9.17685 2.51295 10.4881 2.27882 12.1618C2.12602 13.2541 2 14.3734 2 15.5134C2 16.6534 2.12602 17.7727 2.27882 18.865C2.51295 20.5387 3.95328 21.8499 5.70604 21.9275C6.42013 21.9591 7.26041 21.9834 8 22" stroke="#141B34" stroke-width="1.5" stroke-linecap="round"></path>
              <path d="M6 9V6.5C6 4.01472 8.01472 2 10.5 2C12.9853 2 15 4.01472 15 6.5V9" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M21.2046 15.1045L20.6242 15.6956V15.6956L21.2046 15.1045ZM21.4196 16.4767C21.7461 16.7972 22.2706 16.7924 22.5911 16.466C22.9116 16.1395 22.9068 15.615 22.5804 15.2945L21.4196 16.4767ZM18.0228 15.1045L17.4424 14.5134V14.5134L18.0228 15.1045ZM18.2379 18.0387C18.5643 18.3593 19.0888 18.3545 19.4094 18.028C19.7299 17.7016 19.7251 17.1771 19.3987 16.8565L18.2379 18.0387ZM14.2603 20.7619C13.7039 21.3082 12.7957 21.3082 12.2394 20.7619L11.0786 21.9441C12.2794 23.1232 14.2202 23.1232 15.4211 21.9441L14.2603 20.7619ZM12.2394 20.7619C11.6914 20.2239 11.6914 19.358 12.2394 18.82L11.0786 17.6378C9.86927 18.8252 9.86927 20.7567 11.0786 21.9441L12.2394 20.7619ZM12.2394 18.82C12.7957 18.2737 13.7039 18.2737 14.2603 18.82L15.4211 17.6378C14.2202 16.4587 12.2794 16.4587 11.0786 17.6378L12.2394 18.82ZM14.2603 18.82C14.8082 19.358 14.8082 20.2239 14.2603 20.7619L15.4211 21.9441C16.6304 20.7567 16.6304 18.8252 15.4211 17.6378L14.2603 18.82ZM20.6242 15.6956L21.4196 16.4767L22.5804 15.2945L21.785 14.5134L20.6242 15.6956ZM15.4211 18.82L17.8078 16.4767L16.647 15.2944L14.2603 17.6377L15.4211 18.82ZM17.8078 16.4767L18.6032 15.6956L17.4424 14.5134L16.647 15.2945L17.8078 16.4767ZM16.647 16.4767L18.2379 18.0387L19.3987 16.8565L17.8078 15.2945L16.647 16.4767ZM21.785 14.5134C21.4266 14.1616 21.0998 13.8383 20.7993 13.6131C20.4791 13.3732 20.096 13.1716 19.6137 13.1716V14.8284C19.6145 14.8284 19.619 14.8273 19.6395 14.8357C19.6663 14.8466 19.7183 14.8735 19.806 14.9391C19.9969 15.0822 20.2326 15.3112 20.6242 15.6956L21.785 14.5134ZM18.6032 15.6956C18.9948 15.3112 19.2305 15.0822 19.4215 14.9391C19.5091 14.8735 19.5611 14.8466 19.5879 14.8357C19.6084 14.8273 19.6129 14.8284 19.6137 14.8284V13.1716C19.1314 13.1716 18.7483 13.3732 18.4281 13.6131C18.1276 13.8383 17.8008 14.1616 17.4424 14.5134L18.6032 15.6956Z" fill="#141B34"></path>
            </svg>
            <InputText 
              v-model="formData.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'" 
              placeholder="Confirm Password" 
              fluid 
              class="input_field"
              :class="{ 'p-invalid': errors.confirmPassword }"
            />
            <button 
              type="button" 
              @click="toggleConfirmPasswordVisibility" 
              class="eye-icon"
            >
              <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
            <Message v-if="errors.confirmPassword" severity="error" size="small" variant="simple" class="mt-1">
              {{ errors.confirmPassword }}
            </Message>
            </div>

            <Button
              type="submit"
            severity="secondary" 
              label="Create Account"
            class="sign-in_btn"
              :loading="loading"
          />
        </Form>

        <div class="flex items-center my-4">
          <div class="flex-1 border-t border-gray-300"></div>
          <span class="px-3 text-xs text-gray-500">OR</span>
          <div class="flex-1 border-t border-gray-300"></div>
          </div>

          <button
            type="button"
            @click="handleGoogleSignup"
            :disabled="googleLoading"
            class="google-signin-btn"
          >
            <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

        <div class="mt-4 text-center">
          <span class="text-xs text-gray-600">Already have an account? </span>
            <router-link
              to="/login"
            class="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </router-link>
          </div>
        </div>

      <!-- Right Section - Testimonial -->
      <div class="testimonial">
        <p>"AktivTracker has completely transformed how I manage my job applications. The interface is clean, intuitive, and helps me stay organized throughout my career journey."</p>
        <div class="user-profile-picture"></div>
        <div class="user">
          <span class="username">Michael Chen</span>
          <span class="occupation">Product Manager</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '../../stores/auth'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const loading = ref(false)
const googleLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const formData = reactive({
  full_name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  full_name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => errors[key] = '')

  let isValid = true

  if (!formData.full_name) {
    errors.full_name = 'Full name is required.'
    isValid = false
  }

  if (!formData.username) {
    errors.username = 'Username is required.'
    isValid = false
  } else if (formData.username.length < 3) {
    errors.username = 'Username must be at least 3 characters.'
    isValid = false
  }

  if (!formData.email) {
    errors.email = 'Email is required.'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Invalid email address.'
    isValid = false
  }

  if (!formData.password) {
    errors.password = 'Password is required.'
    isValid = false
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
    isValid = false
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
    isValid = false
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords don't match"
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    loading.value = true
    const { confirmPassword, ...registerData } = formData
    console.log('Register data being sent:', registerData) // Debug log
    await authStore.register(registerData)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Account created successfully!',
      life: 3000
    })
  } catch (err) {
    console.error('Register error:', err) // Debug log
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err.response?.data?.detail || 'Registration failed. Please try again.',
      life: 5000
    })
  } finally {
    loading.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const handleGoogleSignup = async () => {
  try {
    googleLoading.value = true
    const authUrl = await authStore.getGoogleAuthUrl()
    if (authUrl) {
      window.location.href = authUrl
    } else {
      throw new Error('Failed to get Google authentication URL')
    }
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err.message || 'Failed to initiate Google signup',
      life: 5000
    })
    googleLoading.value = false
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1000px;
  height: fit-content;
  display: flex;
  box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
  border-radius: 9px;
  overflow: hidden;
}

.login-form {
  flex: 1;
  min-width: 400px;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 40px;
  background-color: #fff;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px 0;
}

.title {
  font-weight: 700;
  font-size: 15px;
  line-height: 21px;
  text-align: center;
  color: #2B2B2F;
  margin-bottom: 10px;
}

.description {
  max-width: 80%;
  margin: auto;
  font-weight: 600;
  font-size: 10px;
  line-height: 14px;
  text-align: center;
  color: #5F5D6B;
}

.input_container {
  width: 100%;
  height: fit-content;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.icon {
  width: 20px;
  position: absolute;
  z-index: 99;
  left: 12px;
  bottom: 9px;
}

.eye-icon {
  position: absolute;
  right: 12px;
  bottom: 9px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 99;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye-icon:hover svg {
  stroke: #115DFC;
}

.input_field {
  width: auto;
  height: 40px;
  padding: 0 0 0 40px;
  border-radius: 7px;
  outline: none;
  border: 1px solid #e5e5e5;
  filter: drop-shadow(0px 1px 0px #efefef)
    drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
  transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
}

.input_field:focus {
  border: 1px solid transparent;
  box-shadow: 0px 0px 0px 2px #115DFC;
  background-color: transparent;
}

.sign-in_btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 36px;
  background: linear-gradient(180deg, #4480FF 0%, #115DFC 50%, #0550ED 100%);
  box-shadow: 0px 0.5px 0.5px #EFEFEF, 0px 1px 0.5px rgba(239, 239, 239, 0.5);
  border-radius: 5px;
  border: 0;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  color: #ffffff;
  transition: all 0.6s cubic-bezier(0.15, 0.83, 0.66, 1);
}

.sign-in_btn:hover {
  transform: scale(1.01) translateY(-2px);
  box-shadow: 0 10px 20px 0#054eed6b;
}

.google-signin-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  height: 38px;
  background: #fff;
  border: 1px solid #dadce0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #3c4043;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.1);
}

.google-signin-btn:hover {
  background: #f8f9fa;
  box-shadow: 0 1px 3px 0 rgba(60, 64, 67, 0.2);
}

.google-signin-btn:active {
  background: #f1f3f4;
}

.google-signin-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.google-icon {
  flex-shrink: 0;
}

.testimonial {
  flex: 1;
  min-width: 300px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  padding: 40px;
  background: linear-gradient(358.31deg,#fff -24.13%,hsla(0,0%,100%,0) 338.58%),linear-gradient(89.84deg,rgba(230,36,174,.15) .34%,rgba(94,58,255,.15) 16.96%,rgba(10,136,255,.15) 34.66%,rgba(75,191,80,.15) 50.12%,rgba(137,206,0,.15) 66.22%,rgba(239,183,0,.15) 82%,rgba(246,73,0,.15) 99.9%);
}

.testimonial p {
  color: #4d4c6d;
  font-size: 14px;
  text-align: center;
  font-weight: 600;
  line-height: 1.6;
  max-width: 280px;
}

.user-profile-picture {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #00000011;
}

.user {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
}

.username {
  color: #4d4c6d;
  font-size: 11px;
  text-align: center;
  font-weight: 600;
}

.occupation {
  color: rgb(141, 140, 161);
  font-size: 10px;
  text-align: center;
  font-weight: 600;
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    max-width: 400px;
  }
  
  .login-form {
    min-width: unset;
    padding: 30px 20px;
  }
  
  .testimonial {
    min-width: unset;
    padding: 30px 20px;
    display: none; /* Hide testimonial on mobile for cleaner look */
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .login-form {
    background-color: #1f2937;
  }
  
  .title {
    color: #f9fafb;
  }
  
  .description {
    color: #9ca3af;
  }
  
  .input_field {
    background-color: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }
  
  .input_field:focus {
    border-color: #3b82f6;
    box-shadow: 0px 0px 0px 2px #3b82f6;
  }
}
</style>
