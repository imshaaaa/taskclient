<template>
  <div class="px-4 mt-6 sm:px-6 lg:px-8">
    <div class="flex justify-between">
      <div class="sm:flex-auto">
        <h1 class="text-lg font-semibold leading-6 text-gray-900">Users</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all users data.</p>
      </div>
    </div>

    <div class="mt-8 flow-root">
      <div v-if="loadingUser">
        <p class="py-4 text-base text-center text-gray-500 font-medium"><ArrowPathIcon class="h-6 w-6 inline mr-2 animate-spin"></ArrowPathIcon> Fetching Users data...</p>
      </div>
      <div v-else class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Name</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Company codename</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Account</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="user in users" :key="user._id">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{{ user.firstName }} {{ user.lastName }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ user.email }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ user.role }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span v-if="user.approved == true">Verified</span>
                  <span v-else>Pending request</span>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ user.company }}</td>
                <td v-if="!user.approved" class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                  <span>
                    <button @click="deleteRequest(`${user._id}`)" class="rounded-md px-2 py-1 bg-red-500 text-white mr-2"><XMarkIcon class="h-5 w-5 inline"></XMarkIcon> Cancel </button>
                    <button @click="acceptRequest(`${user._id}`)" class="rounded-md px-2 py-1 bg-indigo-500 text-white"><CheckIcon class="h-5 w-5 inline"></CheckIcon> Accept</button>
                  </span>
                </td>
                <td v-if="user.approved" class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                  <span v-if="user.company != 'owner'">
                    <button @click="deleteAccount(`${user._id}`)" class="rounded-md px-2 py-1 bg-red-500 text-white mr-2"><XMarkIcon class="h-5 w-5 inline"></XMarkIcon> Delete Account</button>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon, CheckIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import Swal from 'sweetalert2'

import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toast-notification'

const $toast = useToast()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

onBeforeMount(async() => {
  if(userStore.role == 'user') {
    $toast.info('User redirected as user!', {position: 'top-right'})
    router.push('/')
  } else {
    await axios.post('api/auth/get-session', {
      userId: userStore.token
    })
      .then(res => {
        let auth = res.data.authenticated
        let userData = res.data.user
        let token = res.data.token
        if(auth) {
          userStore.setUser({ userData, auth, token })
          console.log('auth')
        }
        if(res.data.user.company != 'owner') {
          if(userStore.role == 'user') {
            router.push(`/${res.data.user.company}/`)
          } else {
            router.push(`/${res.data.user.company}/admin/task`)
          }
        }
        console.log(userData)
      })
      .catch(err => {
        userStore.$reset()
        router.push('/login')
        $toast.error('User not authenticated!', {position: 'top-right'})
        console.log(err)
      })
  }
})

const users = ref()
const loadingUser = ref(true)
const show = ref(false)

onMounted(async() => {
  let allUsers = await axios.get('api/user/all-superadmin')
  users.value = allUsers.data
  users.value.reverse()
  loadingUser.value = false
})

const deleteRequest = (id) => {
  new Swal({
    title: 'Cancel Request',
    text: "Are you sure that you want to cancel user account request?",
    icon: 'warning',
    confirmButtonText: 'Yes',
    showCancelButton: true,
    preConfirm: () => {
      loadingUser.value = true
      axios.delete(`api/user/delete-request/${id}`)
        .then(async (res) => {
          $toast.success('Account request deleted!', {position: 'top-right'})
          router.go()
          let allUsers = await axios.get('api/user/get-users')
          users.value = allUsers.data
          users.value.reverse()
          loadingUser.value = false
        })
        .catch(err => {
          console.log(err)
        })
    }
  })
}

const deleteAccount = (id) => {
  new Swal({
    title: 'Delete Account',
    text: "Are you sure that you want to delete account ?",
    icon: 'warning',
    confirmButtonText: 'Yes',
    showCancelButton: true,
    preConfirm: () => {
      loadingUser.value = true
      axios.delete(`api/user/delete-request/${id}`)
        .then(async (res) => {
          $toast.success('Account deleted!', {position: 'top-right'})
          router.go()
          let allUsers = await axios.get('api/user/get-users')
          users.value = allUsers.data
          users.value.reverse()
          loadingUser.value = false
        })
        .catch(err => {
          console.log(err)
        })
    }
  })
}

const acceptRequest = (id) => {
  new Swal({
    title: 'Accept Request',
    text: "Are you sure that you want to accept user account request?",
    icon: 'info',
    confirmButtonText: 'Yes',
    showCancelButton: true,
    preConfirm: () => {
      loadingUser.value = true
      axios.put(`api/user/accept-request/${id}`)
        .then(async (res) => {
          $toast.success('Account request approved!', {position: 'top-right'})
          router.go()
          let allUsers = await axios.get('api/user/get-users')
          users.value = allUsers.data
          users.value.reverse()
          loadingUser.value = false
        })
        .catch(err => {
          console.log(err)
        })
    }
  })
}
</script>

<route lang="yaml">
meta:
  layout: admin
</route>