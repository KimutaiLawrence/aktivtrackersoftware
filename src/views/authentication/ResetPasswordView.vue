<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
    <div class="container">
      <!-- Left Section - Reset Password Form -->
      <div class="login-form">
        <div class="header">
          <label class="title">Reset Password</label>
          <p class="description">Enter your new password below to complete the reset process.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
          <div class="input_container">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 11.0041C17.4166 9.91704 16.273 9.15775 14.9519 9.0993C13.477 9.03404 11.9788 9 10.329 9C8.67911 9 7.18091 9.03404 5.70604 9.0993C3.95328 9.17685 2.51295 10.4881 2.27882 12.1618C2.12602 13.2541 2 14.3734 2 15.5134C2 16.6534 2.12602 17.7727 2.27882 18.865C2.51295 20.5387 3.95328 21.8499 5.70604 21.9275C6.42013 21.9591 7.26041 21.9834 8 22" stroke="#141B34" stroke-width="1.5" stroke-linecap="round"></path>
              <path d="M6 9V6.5C6 4.01472 8.01472 2 10.5 2C12.9853 2 15 4.01472 15 6.5V9" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M21.2046 15.1045L20.6242 15.6956V15.6956L21.2046 15.1045ZM21.4196 16.4767C21.7461 16.7972 22.2706 16.7924 22.5911 16.466C22.9116 16.1395 22.9068 15.615 22.5804 15.2945L21.4196 16.4767ZM18.0228 15.1045L17.4424 14.5134V14.5134L18.0228 15.1045ZM18.2379 18.0387C18.5643 18.3593 19.0888 18.3545 19.4094 18.028C19.7299 17.7016 19.7251 17.1771 19.3987 16.8565L18.2379 18.0387ZM14.2603 20.7619C13.7039 21.3082 12.7957 21.3082 12.2394 20.7619L11.0786 21.9441C12.2794 23.1232 14.2202 23.1232 15.4211 21.9441L14.2603 20.7619ZM12.2394 20.7619C11.6914 20.2239 11.6914 19.358 12.2394 18.82L11.0786 17.6378C9.86927 18.8252 9.86927 20.7567 11.0786 21.9441L12.2394 20.7619ZM12.2394 18.82C12.7957 18.2737 13.7039 18.2737 14.2603 18.82L15.4211 17.6378C14.2202 16.4587 12.2794 16.4587 11.0786 17.6378L12.2394 18.82ZM14.2603 18.82C14.8082 19.358 14.8082 20.2239 14.2603 20.7619L15.4211 21.9441C16.6304 20.7567 16.6304 18.8252 15.4211 17.6378L14.2603 18.82ZM20.6242 15.6956L21.4196 16.4767L22.5804 15.2945L21.785 14.5134L20.6242 15.6956ZM15.4211 18.82L17.8078 16.4767L16.647 15.2944L14.2603 17.6377L15.4211 18.82ZM17.8078 16.4767L18.6032 15.6956L17.4424 14.5134L16.647 15.2945L17.8078 16.4767ZM16.647 16.4767L18.2379 18.0387L19.3987 16.8565L17.8078 15.2945L16.647 16.4767ZM21.785 14.5134C21.4266 14.1616 21.0998 13.8383 20.7993 13.6131C20.4791 13.3732 20.096 13.1716 19.6137 13.1716V14.8284C19.6145 14.8284 19.619 14.8273 19.6395 14.8357C19.6663 14.8466 19.7183 14.8735 19.806 14.9391C19.9969 15.0822 20.2326 15.3112 20.6242 15.6956L21.785 14.5134ZM18.6032 15.6956C18.9948 15.3112 19.2305 15.0822 19.4215 14.9391C19.5091 14.8735 19.5611 14.8466 19.5879 14.8357C19.6084 14.8273 19.6129 14.8284 19.6137 14.8284V13.1716C19.1314 13.1716 18.7483 13.3732 18.4281 13.6131C18.1276 13.8383 17.8008 14.1616 17.4424 14.5134L18.6032 15.6956Z" fill="#141B34"></path>
            </svg>
            <InputText 
              v-model="formData.new_password"
              :type="showPassword ? 'text' : 'password'" 
              placeholder="New Password" 
              fluid 
              class="input_field"
              :class="{ 'p-invalid': errors.new_password }"
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
            <Message v-if="errors.new_password" severity="error" size="small" variant="simple" class="mt-1">
              {{ errors.new_password }}
            </Message>
          </div>

          <div class="input_container">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 11.0041C17.4166 9.91704 16.273 9.15775 14.9519 9.0993C13.477 9.03404 11.9788 9 10.329 9C8.67911 9 7.18091 9.03404 5.70604 9.0993C3.95328 9.17685 2.51295 10.4881 2.27882 12.1618C2.12602 13.2541 2 14.3734 2 15.5134C2 16.6534 2.12602 17.7727 2.27882 18.865C2.51295 20.5387 3.95328 21.8499 5.70604 21.9275C6.42013 21.9591 7.26041 21.9834 8 22" stroke="#141B34" stroke-width="1.5" stroke-linecap="round"></path>
              <path d="M6 9V6.5C6 4.01472 8.01472 2 10.5 2C12.9853 2 15 4.01472 15 6.5V9" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M21.2046 15.1045L20.6242 15.6956V15.6956L21.2046 15.1045ZM21.4196 16.4767C21.7461 16.7972 22.2706 16.7924 22.5911 16.466C22.9116 16.1395 22.9068 15.615 22.5804 15.2945L21.4196 16.4767ZM18.0228 15.1045L17.4424 14.5134V14.5134L18.0228 15.1045ZM18.2379 18.0387C18.5643 18.3593 19.0888 18.3545 19.4094 18.028C19.7299 17.7016 19.7251 17.1771 19.3987 16.8565L18.2379 18.0387ZM14.2603 20.7619C13.7039 21.3082 12.7957 21.3082 12.2394 20.7619L11.0786 21.9441C12.2794 23.1232 14.2202 23.1232 15.4211 21.9441L14.2603 20.7619ZM12.2394 20.7619C11.6914 20.2239 11.6914 19.358 12.2394 18.82L11.0786 17.6378C9.86927 18.8252 9.86927 20.7567 11.0786 21.9441L12.2394 20.7619ZM12.2394 18.82C12.7957 18.2737 13.7039 18.2737 14.2603 18.82L15.4211 17.6378C14.2202 16.4587 12.2794 16.4587 11.0786 17.6378L12.2394 18.82ZM14.2603 18.82C14.8082 19.358 14.8082 20.2239 14.2603 20.7619L15.4211 21.9441C16.6304 20.7567 16.6304 18.8252 15.4211 17.6378L14.2603 18.82ZM20.6242 15.6956L21.4196 16.4767L22.5804 15.2945L21.785 14.5134L20.6242 15.6956ZM15.4211 18.82L17.8078 16.4767L16.647 15.2944L14.2603 17.6377L15.4211 18.82ZM17.8078 16.4767L18.6032 15.6956L17.4424 14.5134L16.647 15.2945L17.8078 16.4767ZM16.647 16.4767L18.2379 18.0387L19.3987 16.8565L17.8078 15.2945L16.647 16.4767ZM21.785 14.5134C21.4266 14.1616 21.0998 13.8383 20.7993 13.6131C20.4791 13.3732 20.096 13.1716 19.6137 13.1716V14.8284C19.6145 14.8284 19.619 14.8273 19.6395 14.8357C19.6663 14.8466 19.7183 14.8735 19.806 14.9391C19.9969 15.0822 20.2326 15.3112 20.6242 15.6956L21.785 14.5134ZM18.6032 15.6956C18.9948 15.3112 19.2305 15.0822 19.4215 14.9391C19.5091 14.8735 19.5611 14.8466 19.5879 14.8357C19.6084 14.8273 19.6129 14.8284 19.6137 14.8284V13.1716C19.1314 13.1716 18.7483 13.3732 18.4281 13.6131C18.1276 13.8383 17.8008 14.1616 17.4424 14.5134L18.6032 15.6956Z" fill="#141B34"></path>
            </svg>
            <InputText 
              v-model="formData.confirm_password"
              :type="showConfirmPassword ? 'text' : 'password'" 
              placeholder="Confirm New Password" 
              fluid 
              class="input_field"
              :class="{ 'p-invalid': errors.confirm_password }"
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
            <Message v-if="errors.confirm_password" severity="error" size="small" variant="simple" class="mt-1">
              {{ errors.confirm_password }}
            </Message>
          </div>

          <Button 
            type="submit" 
            severity="secondary" 
            label="Reset Password" 
            class="sign-in_btn"
            :loading="loading"
          />
        </Form>

        <div class="mt-4 text-center">
          <span class="text-xs text-gray-600">Remember your password? </span>
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
        <p>"The password reset was seamless and secure. I appreciate the quick and reliable process."</p>
        <div class="user-profile-picture"></div>
        <div class="user">
          <span class="username">Emma Wilson</span>
          <span class="occupation">UX Designer</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '../../stores/auth'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()

const loading = ref(false)
const token = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const formData = reactive({
  new_password: '',
  confirm_password: ''
})

const errors = reactive({
  new_password: '',
  confirm_password: ''
})

const validateForm = () => {
  errors.new_password = ''
  errors.confirm_password = ''
  
  let isValid = true
  
  if (!formData.new_password) {
    errors.new_password = 'New password is required.'
    isValid = false
  } else if (formData.new_password.length < 8) {
    errors.new_password = 'Password must be at least 8 characters.'
    isValid = false
  }
  
  if (!formData.confirm_password) {
    errors.confirm_password = 'Please confirm your password.'
    isValid = false
  } else if (formData.new_password !== formData.confirm_password) {
    errors.confirm_password = "Passwords don't match"
    isValid = false
  }
  
  return isValid
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  try {
    loading.value = true
    const resetData = {
      token: token.value,
      new_password: formData.new_password
    }
    console.log('Reset password data being sent:', resetData) // Debug log
    await authStore.resetPassword(resetData)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Password reset successfully! You can now sign in.',
      life: 5000
    })
    router.push('/login')
  } catch (err) {
    console.error('Reset password error:', err) // Debug log
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err.response?.data?.detail || 'Failed to reset password. Please try again.',
      life: 5000
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Get token from URL query parameters
  token.value = route.query.token || ''
  if (!token.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Invalid or missing reset token.',
      life: 5000
    })
    router.push('/forgot-password')
  }
})
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