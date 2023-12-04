<template>
  <div class="flex justify-center items-center h-screen bg-white p-4">

    <div class="mx-auto bg-gray-100 w-full sm:w-full sm:max-w-sm px-4 py-6 rounded">
      <p class="text-2xl text-center text-gray-600 font-bold mb-6">Log in to your account</p>
      <form class="space-y-6">
        <div>
          <label class="block text-sm font-medium leading-6 text-gray-900">Email</label>
          <div class="mt-2">
            <input type="email" v-bind="email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-1" />
            <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
            <p v-if="isError" class="text-sm text-red-500">{{ isError.email }}</p>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium leading-6 text-gray-900">Password</label>
          </div>
          <div class="mt-2">
            <input type="password" v-bind="password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-1" />
            <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</p>
            <p v-if="isError" class="text-sm text-red-500">{{ isError.password }}</p>
          </div>
        </div>
        <div class="text-center">
          <button class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400" :disabled="!meta.valid" @click.prevent="login">
            <span v-if="isLoading">
              <ArrowPathIcon class="h-5 w-5 inline mr-2 animate-spin"></ArrowPathIcon>
              Signing in...
            </span>
            <span v-else>
              Sign in
            </span>
          </button>
          <p class="mt-2 text-gray-700 text-sm">Dont have an account? <router-link class="font-bold" to="/register">register</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import axios from 'axios'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toast-notification'
import { useUserStore } from '@/stores/user'

const $toast = useToast()
const router = useRouter()
const route = useRoute()
const user = useUserStore()

onMounted(async() => {
  await axios.post('api/auth/get-session', {
    userId: user.token
  })
    .then(res => {
      let auth = res.data.authenticated
      let userData = res.data.user
      let token = res.data.token
      
      if(auth) {
        user.setUser({ userData, auth, token })
        $toast.info('User is redirected!', {position: 'top-right'})
        if(user.role == 'user') {
          router.push(`/${res.data.user.company}/`)
        }
        if(user.role == 'admin' || user.role == 'superadmin') {
          router.push(`/${res.data.user.company}/admin/task`)
        }
        console.log('auth')
      }
    })
    .catch(err => {
      console.log('not auth session')
      console.log(err)
    })
})

const { values, errors, defineInputBinds, meta } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
    password: yup.string().required()
  })
})

const email = defineInputBinds('email', {
  validateOnInput: true
})
let password = defineInputBinds('password', {
  validateOnInput: true
})

const isLoading = ref(false)
const isError = ref()

const login = async () => {
  isError.value = ''
  isLoading.value = true
  await axios.post('api/auth/login', {
    email: values.email,
    password: values.password
  })
    .then(res => {
      isLoading.value = false
      $toast.success('Logged in successfully.', {position: 'top-right'})
      let auth = res.data.authenticated
      let userData = res.data.user
      let token = res.data.token
      user.setUser({ userData, auth, token })
      if(user.role == 'user') {
        router.push(`/${res.data.user.company}/`)
      }
      if(user.role == 'admin' || user.role == 'superadmin') {
        if(res.data.user.company == 'owner') {
          router.push('/superadmin/users')
        } else {
          router.push(`/${res.data.user.company}/admin/task`)
        }
      }
      console.log(token)
    })
    .catch(err => {
      $toast.error('An error occured', {position: 'top-right'})
      console.log(err)
      isLoading.value = false
      isError.value = err.response.data.error
    })

}
</script>