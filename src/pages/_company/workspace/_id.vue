<template>
  <div>
    <div v-if="fetchingWorkspace">
      <p class="py-4 text-base text-center text-gray-500 font-medium"><ArrowPathIcon class="h-6 w-6 inline mr-2 animate-spin"></ArrowPathIcon> Fetching Task...</p>
    </div>
    <div v-else class="flex flex-wrap mt-4 sm:gap-x-2 gap-y-2">
      <p v-if="tasks.length == 0" class="text-red-500 p-3 rounded-md bg-red-100 max-w-md">No task assigned on this workspace</p>
      <router-link :to="`/${route.params.company}/task/${task._id}`" v-for="task in tasks" :key="task.id" class="block bg-white shadow px-4 py-4 w-full sm:w-52 rounded-md">
        <div class="flex justify-between">
          <p class="text-gray-600 font-medium">{{ task.title }}</p>
        </div>
        <p class="text-sm text-gray-400 mt-0.5 mb-4">{{ task.workspace.title }}</p>
        <p v-if="(task.todos.filter(tk => tk.done)).length == task.todos.length" class="inline-block py-1 px-2 bg-emerald-100 text-emerald-400 w-50 text-xs rounded-md font-medium mb-4">{{ task.date }}</p>
        <p v-else-if="(task.todos.filter(tk => tk.done)).length != 0" class="inline-block py-1 px-2 bg-orange-100 text-orange-400 w-50 text-xs rounded-md font-medium mb-4">{{ task.date }}</p>
        <p v-else class="inline-block py-1 px-2 bg-gray-100 text-gray-400 w-50 text-xs rounded-md font-medium mb-4">{{ task.date }}</p>
        <div class="flex justify-between mb-2">
          <p class="text-gray-600 text-sm">
            <span v-if="(task.todos.filter(tk => tk.done)).length == task.todos.length">
              Completed
            </span>
            <span v-else-if="(task.todos.filter(tk => tk.done)).length != 0">
              In Progress
            </span>
            <span v-else>New</span>
          </p>
          <p class="text-gray-400 font-medium text-sm"> {{ (task.todos.filter(tk => tk.done == true)).length }} / {{ task.todos.length }}</p>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-1">
          <div class="h-1 rounded-full " :class="[(task.todos.filter(tk => tk.done == true)).length != task.todos.length ? 'bg-orange-500': '', (task.todos.filter(tk => tk.done == true)).length == task.todos.length ? 'bg-emerald-500': '']" :style="{ 'width': (task.todos.filter(tk => tk.done == true)).length / task.todos.length * 100 + '%' }"></div>
        </div>
        </router-link>
    </div>
  </div>
</template>

<script setup>
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
const route = useRoute()
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toast-notification'

const $toast = useToast()
const router = useRouter()
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
          console.log('auth')
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

const fetchingWorkspace = ref(true)
const tasks = ref()

onMounted(async () => {
  await axios.post('api/workspace/user/selected-workspace', {
    workspaceId: route.params.id,
    userId: user.id
  })
    .then(res => {
      tasks.value = res.data
      if(res.data.length == 0) {
        $toast.warning('No task assigned on this workspace', {position: 'top-right'})
        setTimeout(() => $toast.info('redirected...', {position: 'top-right'}), 200)
        router.push(`/${route.params.company}/workspace`)
      }
      console.log(res)
    })
    .catch(err => {
      $toast.error('Workspace doesnt exist!', {position: 'top-right'})
      router.push(`/${route.params.company}/workspace`)
      console.log(err)
    })
  
    fetchingWorkspace.value = false
})
</script>

<route lang="yaml">
meta:
  layout: users
</route>