import axios from 'axios'
import baseUrl from './Base_Url/baseUrl'
import { showToast } from './toastService'

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isUnauthorizedToastShown = false // flag to track if the toast has been shown

const resetUnauthorizedToast = () => {
  isUnauthorizedToastShown = false
}

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      const { status } = error.response

      if (status === 401 && !isUnauthorizedToastShown) {
        isUnauthorizedToastShown = true
        showToast('Unauthorized user. Please login.')
        // localStorage.clear()
        // window.location.href = '/auth/sign-in'
        setTimeout(resetUnauthorizedToast, 5000) // e.g., 5 seconds
      }

      if (status === 403) {
        showToast('❌ You are not allowed to access this page!')
        window.location.href = '/admin/dashboard'
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
