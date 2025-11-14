import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public routes
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/authentication/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/authentication/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/authentication/ForgotPasswordView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/authentication/ResetPasswordView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: () => import('../views/authentication/VerifyEmailView.vue')
    },
    {
      path: '/auth/google/callback',
      name: 'google-callback',
      component: () => import('../views/authentication/GoogleCallbackView.vue')
    },
    // Protected routes with MainLayout
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: 'dashboard'
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue')
        },
        {
          path: 'jobs',
          name: 'jobs',
          component: () => import('../views/jobsManagement/JobsView.vue')
        },
        {
          path: 'jobs/:jobId',
          name: 'view-job',
          component: () => import('../views/jobsManagement/ViewJob.vue')
        },
        {
          path: 'jobs/:jobId/edit',
          name: 'edit-job',
          component: () => import('../views/jobsManagement/EditJob.vue')
        },
        {
          path: 'scholarships',
          name: 'scholarships',
          component: () => import('../views/scholarshipsManagement/ScholarshipsView.vue')
        },
        {
          path: 'activities',
          name: 'activities',
          component: () => import('../views/activitiesManagement/ActivitiesView.vue')
        },
        {
          path: 'opportunities',
          name: 'opportunities',
          component: () => import('../views/opportunitiesManagement/OpportunitiesView.vue')
        },
        {
          path: 'documents',
          name: 'documents',
          component: () => import('../views/documentsManagement/DocumentsView.vue')
        },
        {
          path: 'analytics',
          name: 'analytics',
          component: () => import('../views/AnalyticsView.vue')
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/ProfileView.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/SettingsView.vue')
        }
      ]
    },
    // 404 Not Found
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
