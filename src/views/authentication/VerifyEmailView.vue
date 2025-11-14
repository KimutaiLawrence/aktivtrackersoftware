<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
    <div class="container">
      <div class="login-form">
        <div class="header">
          <label class="title">Verify Email</label>
          <p class="description">Enter the verification code sent to your email address.</p>
        </div>

        <Form v-slot="$form" :resolver="resolver" :initialValues="initialValues" @submit="onFormSubmit" class="flex flex-col gap-4">
          <div class="input_container">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M7 8.5L9.94202 10.2394C11.6572 11.2535 12.3428 11.2535 14.058 10.2394L17 8.5" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round"></path>
            </svg>
            <InputText 
              name="token" 
              type="text" 
              placeholder="Verification Code" 
              fluid 
              class="input_field"
              :class="{ 'p-invalid': $form.token?.invalid }"
            />
            <Message v-if="$form.token?.invalid" severity="error" size="small" variant="simple" class="mt-1">
              {{ $form.token.error?.message }}
            </Message>
          </div>

          <Button 
            type="submit" 
            severity="secondary" 
            label="Verify Email" 
            class="sign-in_btn"
            :loading="loading"
          />
        </Form>

        <div class="mt-4 text-center">
          <span class="text-xs text-gray-600">Didn't receive the code? </span>
          <button
            @click="resendVerification"
            class="text-xs text-primary-600 hover:text-primary-700 font-medium"
            :disabled="resendLoading"
          >
            {{ resendLoading ? 'Sending...' : 'Resend' }}
          </button>
        </div>

        <div class="mt-4 text-center">
          <router-link
            to="/login"
            class="text-xs text-gray-600 hover:text-primary-700 font-medium"
          >
            Back to Login
          </router-link>
        </div>
      </div>

      <div class="testimonial">
        <p>"Email verification was quick and easy. I was able to access my account right away after verification."</p>
        <div class="user-profile-picture"></div>
        <div class="user">
          <span class="username">Lisa Rodriguez</span>
          <span class="occupation">Marketing Specialist</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '../../stores/auth'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { Form } from '@primevue/forms'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()

const loading = ref(false)
const resendLoading = ref(false)
const token = ref('')

const initialValues = ref({
  token: ''
})

const resolver = ref(zodResolver(
  z.object({
    token: z.string().min(1, { message: 'Verification code is required.' })
  })
))

const onFormSubmit = async ({ valid, data }) => {
  if (valid) {
    try {
      loading.value = true
      console.log('Verify email data being sent:', data) // Debug log
      await authStore.verifyEmail(data.token)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Email verified successfully! You can now sign in.',
        life: 5000
      })
      router.push('/login')
    } catch (err) {
      console.error('Verify email error:', err) // Debug log
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: err.response?.data?.detail || 'Failed to verify email. Please try again.',
        life: 5000
      })
    } finally {
      loading.value = false
    }
  }
}

const resendVerification = async () => {
  try {
    resendLoading.value = true
    // This would typically require the user's email, but for now we'll show a message
    toast.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Please check your email for the verification code.',
      life: 3000
    })
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to resend verification code.',
      life: 5000
    })
  } finally {
    resendLoading.value = false
  }
}

onMounted(() => {
  // Get token from URL query parameters if available
  const urlToken = route.query.token || ''
  if (urlToken) {
    token.value = urlToken
    initialValues.value.token = urlToken
  }
})
</script>

<style scoped>
.container {
  height: fit-content;
  display: flex;
  box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
  border-radius: 9px;
}

.login-form {
  width: 350px;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  border-radius: 9px 0 0 9px;
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
  width: 250px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(358.31deg,#fff -24.13%,hsla(0,0%,100%,0) 338.58%),linear-gradient(89.84deg,rgba(230,36,174,.15) .34%,rgba(94,58,255,.15) 16.96%,rgba(10,136,255,.15) 34.66%,rgba(75,191,80,.15) 50.12%,rgba(137,206,0,.15) 66.22%,rgba(239,183,0,.15) 82%,rgba(246,73,0,.15) 99.9%);
  border-radius: 0 9px 9px 0;
}

.testimonial p {
  color: #4d4c6d;
  font-size: 11px;
  text-align: center;
  font-weight: 600;
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