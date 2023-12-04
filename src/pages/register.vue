<template>
  <div class="flex justify-center items-center h-screen bg-white p-4">
    <div class="mx-auto bg-gray-100 w-full sm:w-full sm:max-w-sm px-4 py-6 rounded">
      <p class="text-2xl text-center text-gray-600 font-bold mb-6">Sign up</p>
      <div class="space-y-6">
        <div class="flex justify-between gap-x-1">
          <div class="w-1/2">
          <label class="block text-sm font-medium leading-6 text-gray-900">Firstname</label>
          <input type="text" v-bind="firstName" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-1" />
          <p v-if="errors.Firstname" class="text-sm text-red-500">{{ errors.Firstname }}</p>
          </div>
          <div class="w-1/2">
          <label class="block text-sm font-medium leading-6 text-gray-900">Lastname</label>
          <input type="text" v-bind="lastName" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-1" />
          <p v-if="errors.Lastname" class="text-sm text-red-500">{{ errors.Lastname }}</p>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium leading-6 text-gray-900">Role</label>
          <select v-model="role" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
            <option value="user" selected>User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>
       <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Company codename</label>
            {{ codename }}
          </div>
          <div v-if="role != 'superadmin'" class="mt-2">
            <select v-model="codename" class="relative block w-full rounded-md rounded-t-md border-0 bg-transparent py-1.5 text-gray-600 ring-1 ring-inset ring-gray-300 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <option value="" disabled>Select an option</option>
              <option v-for="codename in codenames" :key="codename._id" :value="codename.company">{{ codename.company }}</option>
            </select>
          </div>
          <div v-else class="mt-2">
            <input type="text" required @input="e => codename = e.target.value" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-1" />
          </div>
       </div>
       <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
          </div>
          <div class="mt-2">
            <input type="email" v-bind="email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-1" />
            <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
            <p v-if="isError" class="text-sm text-red-500">{{ isError.email }}</p>
          </div>
       </div>
        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
          </div>
          <div class="mt-2">
            <input type="password" v-bind="password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-1" />
            <p v-if="errors.Password" class="text-sm text-red-500">{{ errors.Password }}</p>
          </div>
          <div class="mt-6 flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
          </div>
          <div class="mt-2">
            <input type="password" v-bind="confirmPassword" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-1" />
            <p v-if="errors.ConfirmPassword" class="text-sm text-red-500">{{ errors.ConfirmPassword }}</p>
          </div>
        </div>
        <div class="text-center">
          <button class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400" :disabled="!meta.valid" @click="register">
            <span v-if="isLoading">
              <ArrowPathIcon class="h-5 w-5 inline mr-2 animate-spin"></ArrowPathIcon>
              Signing up...
            </span>
            <span v-else>
              Sign up
            </span>
          </button>
          <p class="mt-2 text-gray-700 text-sm">Already have an account? <router-link class="font-bold" to="/login">login</router-link></p>
        </div>
      </div>
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

const codename = ref()

const codenames = ref()

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
    })
  await axios.get('api/auth/get-codenames')
    .then(res => {
      codenames.value = res.data.filter(c => c.company != 'owner')
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
})

const { values, errors, defineInputBinds, meta } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
    Firstname: yup.string().required(),
    Lastname: yup.string().required(),
    Password: yup.string().min(6).required(),
    ConfirmPassword: yup.string()
      .oneOf([yup.ref('Password')], 'Password must match')
      .required('Confirm Password is required.')
  })
})

const email = defineInputBinds('email', {
  validateOnInput: true
})
const firstName = defineInputBinds('Firstname', {
  validateOnInput: true
})
const lastName = defineInputBinds('Lastname', {
  validateOnInput: true
})
const password =defineInputBinds('Password', {
  validateOnInput: true
})
const confirmPassword =defineInputBinds('ConfirmPassword', {
  validateOnInput: true
})
const role = ref('user')
const isError = ref()
const isLoading = ref(false)

const register = async () => {
  console.log(values.email)
  isLoading.value = true
  await axios.post('api/auth/register', {
    firstName: values.Firstname,
    lastName: values.Lastname,
    role: role.value,
    email: values.email,
    company: codename.value.toLowerCase(),
    password: values.ConfirmPassword
  })
    .then(res => {
      $toast.success('Account successfully created', {position: 'top-right'})
      setTimeout(() => { $toast.info('Account need to verify by admin!', {position: 'top-right'}) },1000)
      isLoading.value = false
      router.push('/login')
    })
    .catch(err => { 
      isLoading.value = false
      isError.value = err.response.data.error
      console.log(err)
    })
}
</script>