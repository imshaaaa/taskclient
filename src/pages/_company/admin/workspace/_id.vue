<template>
  <div class="px-4 mt-6 sm:px-6 lg:px-8">
    <div v-if="isLoading" class="text-center">
        <p class="py-4 text-base text-center text-gray-500 font-medium"><ArrowPathIcon class="h-6 w-6 inline mr-2 animate-spin"></ArrowPathIcon> Fetching Workspace Tasks..</p>
    </div>
    <div v-else>
      <div class="flex justify-between">
        <h1 class="text-lg font-semibold leading-6 text-gray-900">{{ workspaceTasks.title }}</h1>
        <button @click="deleteWorkspace" v-if="workspaceTasks.tasks.length == 0" class="px-3 py-0.5 text-white bg-red-500 rounded-md">Delete workspace</button>
      </div>
      
      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Task Title</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date Created</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">To do's</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Assigned</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="task in workspaceTasks.tasks" :key="task.id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{{ task.title }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{{ task.date }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{{ task.todos.length }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{{ task.assignedUser.name }}</td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <router-link :to="`/${route.params.company}/admin/task/${task._id}`" class="text-indigo-600 hover:text-indigo-900"
                      >View</router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toast-notification'
import Swal from 'sweetalert2'

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
  if(user.role == 'user') {
    $toast.info('User redirected as user!', {position: 'top-right'})
    router.push(`/${route.params.company}/`)
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

let isLoading = ref(true)
let workspaceTasks = ref()

onMounted(async() => {
  let newWorkspace = await axios.post('api/workspace/selected-workspace', {
    workspaceId: route.params.id
  })
    .then(res => {
      workspaceTasks.value = res.data
      console.log(res)
    })
    .catch(err => {
      $toast.error('Workspace doesnt exist', {position: 'top-right'})
      router.push(`/${route.params.company}/admin/workspace`)
      console.log(err)
    })
  
  isLoading.value = false
})

const deleteWorkspace = async () => {
  new Swal({
    title: 'Delete',
    text: "Are you sure that you want to delete this workspace?",
    icon: 'warning',
    confirmButtonText: 'Yes',
    showCancelButton: true,
    preConfirm: () => {
      $toast.info('deleting workspace...', {position: 'top-right'})
    axios.post('api/workspace/delete-workspace', {
      workspaceId: route.params.id 
    })
      .then(res => {
        $toast.success('Workspace deleted.', {position: 'top-right'})
        router.push(`/${route.params.company}/admin/workspace`)
        console.log(res)
      }) 
      .catch(err => {
        $toast.error('An error occured', {position: 'top-right'})
        console.log(err)
      })
    }
  })
}
</script>

<route lang="yaml">
meta:
  layout: users
</route>