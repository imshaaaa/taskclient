<template>
  <div class="px-4 mt-6 sm:px-6 lg:px-8">
    <div class="flex justify-between">
      <div class="sm:flex-auto">
        <h1 class="text-lg font-semibold leading-6 text-gray-900">Task</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all {{ route.params.company }} task data.</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button type="button" @click="openAddTask" class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add Task</button>
      </div>
    </div>

    <TransitionRoot as="template" :show="isNewTask">
    <Dialog as="div" class="relative z-10">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg sm:p-6">
              <div>
                <DialogTitle class="text-xl font-bold text-gray-600 mb-2">New Task</DialogTitle>
                  <label for="email" class="block text-md font-medium leading-6 text-gray-600">Title</label>
                  <div class="mt-2 space-y-2">
                    <input type="text" v-bind="title" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Task title" />
                    <p v-if="errors.title" class="text-sm text-red-500">{{ errors.title }}</p>
                    <label for="workspace" class="block text-md font-medium leading-6 text-gray-600">Workspace</label>
                    <select v-model="assignedWorkspace" class="relative block w-full rounded-md rounded-t-md border-0 bg-transparent py-1.5 text-gray-600 ring-1 ring-inset ring-gray-300 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                      <option value="">Select an option</option>
                      <option v-for="workspace in allWorkspace" :key="workspace._id" :value="{ id: workspace._id, title: workspace.title }">{{ workspace.title }}</option>
                    </select>
                    <p v-if="errorWorkspaceAssigned.msg != ''" class="text-sm text-red-500">{{ errorWorkspaceAssigned.msg }}</p>
                    <label for="email" class="block text-md font-medium leading-6 text-gray-600">To do's</label>
                     <div class="flex justify-between space-x-2 mb-2">
                        <input v-model="newTodo" type="text" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="todo" />
                        <button class="px-3 py-1 bg-indigo-500 text-white rounded" @click="addNewTodo">Add</button>
                     </div>
                    <p v-if="errorTodo.msg != ''" class="block text-sm text-red-500">{{ errorTodo.msg }}</p>
                     
                     <div v-for="todo in newTodos" :key="todo.id" class="flex justify-between px-4 py-1 rounded bg-gray-50">
                       <p class="text-gray-600">{{ todo.title }}</p>
                       <button @click="deleteNewTodo(`${todo.id}`)" class="px-3 py-1 bg-red-500 text-white rounded">remove</button>
                     </div>
                     
                    <label for="workspace" class="block text-md font-medium leading-6 text-gray-600">Assign to</label>
                    <select v-model="assignedUser" class="relative block w-full rounded-md rounded-t-md border-0 bg-transparent py-1.5 text-gray-600 ring-1 ring-inset ring-gray-300 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                      <option value="">Select an option</option>
                      <option v-for="workspace in workspaceUsers" :key="workspace._id" :value="{ 
                          id: workspace._id,
                          name: `${workspace.firstName} ${workspace.lastName}`
                      }">{{ workspace.firstName }} {{ workspace.lastName }}</option>
                    </select>
                    <p v-if="errorUserAssigned.msg != ''" class="text-sm text-red-500">{{ errorUserAssigned.msg }}</p>
                  </div>
               
                <div class="flex justify-end mt-6">
                  <button class="px-4 py-1.5 bg-red-50 rounded text-red-500 mr-3" @click="isNewTaskOpen(false)">Cancel</button>
                  <button class="px-4 py-1.5 bg-indigo-500 text-white rounded" @click="addTask" :disabled="!meta.valid">
                  <span v-if="isLoading">
                    <ArrowPathIcon class="h-5 w-5 inline mr-2 animate-spin"></ArrowPathIcon>
                    Creating Task...
                  </span>
                  <span v-else>
                    Add Task
                  </span>
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

    <div class="mt-8 flow-root">
      <div v-if="isLoading">
        <p class="py-4 text-base text-center text-gray-500 font-medium"><ArrowPathIcon class="h-6 w-6 inline mr-2 animate-spin"></ArrowPathIcon> Fetching Task data...</p>
      </div>
      <div v-else class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Task Title</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Workspace</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Progress</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Assigned to</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span class="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="task in allTasks" :key="task._id">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{{ task.title }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ task.workspace.title }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ task.date }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span class='text-cyan-600' v-if="task.todos.every(d => d.done === false) && task.todos.every(d => d.done !== true)">Not started yet</span>
                  <span class="text-emerald-600" v-else-if="task.todos.every(d => d.done === true )">Completed</span>
                  <span class='text-orange-500' v-else>In progress</span>
                  
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ task.assignedUser.name }}</td>
                <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                <router-link :to="`task/${task._id}`" class="text-indigo-600 hover:text-indigo-900"
                    >View</router-link>
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
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toast-notification'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const $toast = useToast()
const router = useRouter()
const route = useRoute()
const user = useUserStore()

const isLoading = ref(false)

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

let workspaceUsers = ref()
let allWorkspace = ref()
let assignedWorkspace = ref("")
let assignedUser = ref("")
let allTasks = ref()

onMounted(async() => {
  isLoading.value = true
  let task = ''
  let workspace;
  let filteredWorkspace;
  workspace = await axios.get('api/workspace/get-users')
  workspaceUsers.value = workspace.data.filter(user => user.company == route.params.company)
  filteredWorkspace = await axios.get('api/workspace/get-workspace')
  allWorkspace.value = filteredWorkspace.data.filter(ws => ws.company == route.params.company)
  task = await axios.get('api/task/get-task')
  allTasks.value = task.data.filter(t => t.company == route.params.company)
  isLoading.value = false
  console.log(workspaceUsers.value)
})

const { values, errors, defineInputBinds, meta, handleSubmit } = useForm({
  validationSchema: yup.object({
    title: yup.string().required()
  })
})

const title = defineInputBinds('title', {
  validateOnInput: true
})

const isNewTask = ref(false)
const isNewTaskOpen  = (value) => {
  isNewTask.value = value
}

const newTodo = ref('')
const newTodos = ref([])
const errorTodo = reactive({
  msg: ''
})
const errorWorkspaceAssigned = reactive({
  msg: ''
})
const errorUserAssigned = reactive({
  msg: ''
})

const addNewTodo = () => {
  errorTodo.msg = ''
  if(newTodo.value == '') return errorTodo.msg = 'todo field is required'
  
  let id = (new Date().getTime() + Math.random()).toString(36)
  let todo = {
    id: id,
    title: newTodo.value,
    done: false
  }
  newTodos.value.push(todo)
  newTodo.value = ''
}
const deleteNewTodo = (todoId) => {
  let index = newTodos.value.findIndex(todo => todo.id === todoId )
  if(index !== -1) {
    newTodos.value.splice(index, 1)
  }
}

const openAddTask = () => {
  if(allWorkspace.value.length == 0 || workspaceUsers.value.length == 0) {
    $toast.info('Must have atleast 1 workspace', {position: 'top-right'})
    $toast.info('Must have atleast 1 user', {position: 'top-right'})
    isNewTask.value = false
  } else {
    isNewTask.value = true
  }
}

const addTask = async () => {
  errorTodo.msg = ''
  errorWorkspaceAssigned.msg = ''
  errorUserAssigned.msg = ''
  if(newTodos.value.length == 0) return errorTodo.msg = "Please add atleast 1 todo's "
  if(assignedWorkspace.value === '') return errorWorkspaceAssigned.msg = "select 1 workspace"
  if(assignedUser.value === '') return errorUserAssigned.msg = "select 1 user"

  isLoading.value = true
  let month = new Intl.DateTimeFormat('en-US', {
  month: 'long',
}).format(new Date());
  let day = new Date().getDate()
  let year = new Date().getFullYear()
  let date = [month,day,year].join(' ')

  await axios.post('api/task/create-task', {
    title: values.title,
    workspace: assignedWorkspace.value,
    date: date,
    assignedUser: assignedUser.value,
    todos: newTodos.value,
    company: route.params.company
  })
    .then(async res => {
      $toast.success('Successfully created a new task.', {position: 'top-right'})
      let newTask = await axios.get('api/task/get-task')
      allTasks.value = newTask.data.filter(t => t.company == route.params.company)
      isLoading.value = false
      console.log(res)
    })
    .catch(err => {
      $toast.error('an error occured', {position: 'top-right'})
      console.log(err)
    })
  isNewTask.value = false
}
</script>

<route lang="yaml">
meta:
  layout: users
</route>