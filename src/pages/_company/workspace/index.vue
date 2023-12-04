<template>
  <div class="h-full">
    <div class="flex justify-between">
    <p class="text-2xl font-bold text-gray-600">Workspace</p>
    </div>
    
    <div v-if="fetchingAllWorkspace">
      <p class="py-4 text-base text-center text-gray-500 font-medium"><ArrowPathIcon class="h-6 w-6 inline mr-2 animate-spin"></ArrowPathIcon> Fetching Task...</p>
    </div>
    <div v-else class="flex flex-wrap mt-4 sm:gap-x-2 gap-y-2 ">
      <router-link :to="`workspace/${data._id}`" v-for="data in workspace" :key="data._id" class="block bg-white shadow px-4 py-2 w-full sm:w-60 rounded-md">
        <div>
          <p class="text-gray-600 font-medium text-lg">{{ data.title }}</p>
        </div>
        <div class="flex space-x-1 mt-2">
          <p class="inline-block py-1 px-2 bg-gray-100 text-gray-400 w-50 text-xs rounded-md font-bold mb-4">  {{ data.tasks.filter(t => t.assignedUser.id == user.id).length }} All Task</p>
          <p class="inline-block py-1 px-2 bg-orange-100 text-orange-400 w-50 text-xs rounded-md font-medium mb-4">  {{ (data.tasks.filter(t => t.assignedUser.id == user.id)).filter(t => t.todos.some(d => d.done !== true)).length }} In progress</p>
          <p class="inline-block py-1 px-2 bg-green-100 text-green-400 w-50 text-xs rounded-md font-medium mb-4">  {{ (data.tasks.filter(t => t.assignedUser.id == user.id)).filter(t => t.todos.every(d => d.done == true )).length }} Completed</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toast-notification'

const $toast = useToast()
const router = useRouter()
const route = useRoute()
const user = useUserStore()

onBeforeMount(async() => {
  await axios.post('api/user/get-superadmins', {
    company: route.params.company
  })
  .then(res => {
    if(res.data.length == 0) {
      $toast.error(`No company named ${route.params.company} exist!`, {position: 'top-right'})
      router.back()
    }
  })
  .catch(err => {
    console.log(err)
  })
  if(user.role == 'admin' || user.role == 'superadmin') {
    $toast.info('User redirected as admin!', {position: 'top-right'})
    router.push(`/${route.params.company}/admin/task`)
  } else {
    await axios.post('api/auth/get-session', {
      userId: user.token
    })
      .then(res => {
        let auth = res.data.authenticated
        let userData = res.data.user
        let token = res.data.token
        if(auth) {
          user.setUser({ userData, auth, token })
          console.log('auth tk')
          console.log(user.token)
        }
      })
      .catch(err => {
        user.$reset()
        router.push(`/login`)
        $toast.error('User not authenticated!', {position: 'top-right'})
        console.log('not auth')
      })
  }
})

const fetchingAllWorkspace = ref(true)

const workspace = ref()

onMounted(async () => {
  await axios.get('api/workspace/get-workspace')
    .then(res => {
      workspace.value = res.data.filter(ws => ws.company == route.params.company)
      console.log(workspace.value)
    })
    .catch(err => {
      $toast.error('An error occured!', {position: 'top-right'})
      console.log(err)
    })
  
  fetchingAllWorkspace.value = false
})

</script>

<route lang="yaml">
meta:
  layout: users
</route>