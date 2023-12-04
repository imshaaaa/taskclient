<template>
  <div class="p-4 bg-white text-gray-700 shadow-md rounded-md max-w-md mx-auto h-auto">
    <div v-if="fetchingTask" class="text-center">
      <p class="py-4 text-base text-center text-gray-500 font-medium"><ArrowPathIcon class="h-6 w-6 inline mr-2 animate-spin"></ArrowPathIcon> Fetching Task...</p>
    </div>
    <div v-else v-for="data in selectedTask" :key="data._id">
      <div v-if="updatingTask">
        <p class="py-4 text-base text-center text-gray-500 font-medium"><ArrowPathIcon class="h-6 w-6 inline mr-2 animate-spin"></ArrowPathIcon> Updating Task...</p>
      </div>
      <div v-else>
        <div class="mt-4">
          <label class="font-medium">Title</label>
          <input type="text" v-model="data.title"
          @input="title = $event.target.value" :readonly="isReadOnly" class="block mt-1 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-1 placeholder:text-gray-500" />
          </div> 
        <div class="mt-4">
          <label class="font-medium">Workspace</label>
          <input type="text" readonly="true" :value="data.workspace.title"  class="block mt-1 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-1 placeholder:text-gray-500" />
          </div>
        <div class="mt-4">
          <p class="font-medium">Todos</p>
          <div class="py-2 px-4 flex flex-col gap-y-2">
            <div v-for="todo in data.todos" :key="todo.id" class="flex justify-between">
              <div class="">
                <input v-if="isReadOnly" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" :checked="todo.done" disabled/>
                <input v-else type="checkbox" v-model="todo.done"  @input="todos = data.todos" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" :checked="todo.done"/>
                <label class="ml-2">{{ todo.title }}</label>
              </div>
            </div>
            
          </div>
        </div>
        <div class="flex justify-end">
          <button v-if="isReadOnly" class="px-3 py-1 border border-indigo-500 text-indigo-500 rounded-md hover:bg-indigo-500 hover:text-white" @click="editTask"><PencilSquareIcon class="inline h-4 w-4"></PencilSquareIcon> Edit</button>
          <div v-else class="mt-4">
            <button class="px-3 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white" @click="cancelTask"> Cancel</button>
            <button class="px-3 py-1 ml-2 bg-indigo-500  text-white rounded-md hover:bg-indigo-600 hover:text-white" @click="updateTask"> Update </button>
            <button class="px-3 py-1 ml-2 bg-red-500  text-white rounded-md hover:bg-red-600 hover:text-white" @click="deleteTask"> Delete </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PencilSquareIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
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

const fetchingTask = ref(false)
const selectedTask = ref()

const title = ref('')
const workspace = ref('')
const taskId = ref('')

const todos = ref()

const isReadOnly = ref(true)
const updatingTask = ref(false)

onMounted(async () => {
  fetchingTask.value = true
  let newTask = await axios.post("api/task/selected-task", {
    id: route.params.id
  })
    .then(res => {
      selectedTask.value = res.data
      title.value = selectedTask.value[0].title
      workspace.value = selectedTask.value[0].workspace.id
      taskId.value = selectedTask.value[0]._id
      console.log(res)
    })
    .catch(err => {
      $toast.error('Task doesnt exist', {position: 'top-right'})
      router.push(`/${route.params.company}/admin/task`)
      console.log(err)
    })
  
  fetchingTask.value = false
})

const editTask = () => {
  isReadOnly.value = !isReadOnly.value
}

const cancelTask = () => {
  isReadOnly.value = !isReadOnly.value
  router.go()
}

const updateTask = async () => {
  let tempTitle = ''
  updatingTask.value = true
  await axios.post('api/task/update-task', {
    taskId: taskId.value,
    title: title.value,
    workspaceId: workspace.value,
    todos: todos.value
  })
    .then(res => {
      $toast.info('Task updated', {position: 'top-right'})
      //router.go()
    })
    .catch(err => {
      $toast.error('Error occured', {position: 'top-right'})
      console.log(err)
    })
  
  isReadOnly.value = !isReadOnly.value
  updatingTask.value = false
  
}

const deleteTask = async () => {
  new Swal({
    title: 'Delete',
    text: "Are you sure that you want to delete this task?",
    icon: 'warning',
    confirmButtonText: 'Yes',
    showCancelButton: true,
    preConfirm: () => {
      $toast.info('deleting task...', {position: 'top-right'})
      axios.post('api/task/delete-task', {
        taskId: taskId.value,
        workspaceId: workspace.value
      })
        .then(async (res) => {
          $toast.success('Task deleted!', {position: 'top-right'})
          router.push(`/${route.params.company}/admin/task`)
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