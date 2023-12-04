<template>
  <div>
    <p class="text-2xl font-bold text-gray-600 mb-5">Profile </p>
    <div class="mx-auto h-auto px-4 py-4 rounded-md shadow-lg w-full sm:w-1/2 bg-white">
      <div class="flex justify-between gap-x-4">
        <div class="w-1/2">
        <label class="block text-sm font-medium leading-6 text-gray-900">Firstname</label>
        <input type="text" :value="user.firstName" :readonly="readOnly" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-1" />
        </div>
        <div class="w-1/2">
        <label class="block text-sm font-medium leading-6 text-gray-900">Lastname</label>
        <input type="text" :value="user.lastName" :readonly="readOnly" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-1" />
        </div>
      </div>
      <div class="mt-2">
        <label class="block text-sm font-medium leading-6 text-gray-900">Role</label>
        <select v-model="userRole" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6" disabled>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
      </div>
      <div v-if="!readOnly" class="flex justify-end mt-5 mb-3">
        <button v-if="readOnly" class="px-4 py-1 ring-1 ring-indigo-500 text-indigo rounded-md shadow-md hover:bg-indigo-500 hover:text-white" @click="isReadOnly">Edit</button>
        <div v-else class="flex gap-x-4">
          <button class="px-4 py-1 ring-1 ring-red-500 text-indigo rounded-md shadow-md hover:bg-red-500 hover:text-white" @click="isReadOnly">Cancel</button>
          <button class="px-4 py-1 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600" @click="isReadOnly">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toast-notification'

const time = ref(12)
let date = new Date()
let day = date.getDay() + 1
let hours = date.getHours()
let minutes = date.getMinutes()
let seconds = date.getSeconds()

const total = day * 24 * 60 * 60 * 1000

const minus = 24/24 * 24 * 60 * 60 * 1000

//date.setHours(date.getHours() + 24)

let inputDate = new Date('2023-11-16T12:49:37')


//time.value =  date - year

const $toast = useToast()
const router = useRouter()
const route = useRoute()
const user = useUserStore()
const userRole = user.role

onBeforeMount(async() => {
  await axios.post('api/auth/get-session', {
    userId: user.token
  })
    .then(res => {
      let auth = res.data.authenticated
      let userData = res.data.user
      let token = res.data.token
      if(auth) {
        user.setUser({ userData, auth, token })
        console.log(user)
      }
    })
    .catch(err => {
      user.$reset()
      router.push(`/login`)
      $toast.error('User not authenticated!', {position: 'top-right'})
      console.log('not auth')
    })
})

const readOnly = ref(true)

const isReadOnly = () => readOnly.value = !readOnly.value
</script>

<route lang="yaml">
meta:
  layout: users
</route>