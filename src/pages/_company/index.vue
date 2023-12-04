<template>
  <div class="text-gray-800 overflow-y-scroll">
    <p class="text-2xl text-gray-600 font-bold mb-6">Dashboard</p>
    <!-- Task Statistics -->
    <div class="flex flex-wrap gap-x-0.5 gap-y-6 h-20 h-full">
      <div class="px-4 py-2 mx-auto bg-white shadow rounded  w-full sm:w-6/12 mb-4 sm:mb-0 sm:h-60">
      <p class="text-xl font-bold text-gray-600 py-4">Tasks Completed</p>
      <div v-if="fetchingTask">
        <p class="py-4 text-base text-center text-gray-500 font-medium"><ArrowPathIcon class="h-6 w-6 inline mr-2 animate-spin"></ArrowPathIcon> Fetching Task Data...</p>
      </div>
      <LineChart v-else class="h-60 sm:h-40" :chartData="taskCompleted" />
    </div>
      <div class="px-4 py-2 mx-auto bg-white shadow rounded w-full sm:w-5/12 mb-4 sm:mb-0 sm:h-60">
      <p class="text-xl font-bold text-gray-600 py-4">Tasks Statistics</p>
      <div v-if="fetchingAbout">
        <p class="py-4 text-base text-center text-gray-500 font-medium"><ArrowPathIcon class="h-6 w-6 inline mr-2 animate-spin"></ArrowPathIcon> Fetching Statistics Data...</p>
      </div>
      <PolarAreaChart v-else class="h-60 sm:h-40" :chartData="taskAbout" />
    </div>
      <div class="px-4 py-2 mx-auto bg-white shadow rounded w-full sm:w-5/12 mb-4 sm:mb-0 sm:h-60">
      <p class="text-xl font-bold text-gray-600 py-4">Tasks Workspace</p>
      <div v-if="fetchingtaskWorkspace">
        <p class="py-4 text-base text-center text-gray-500 font-medium"><ArrowPathIcon class="h-6 w-6 inline mr-2 animate-spin"></ArrowPathIcon> Fetching Task Workspace Data...</p>
      </div>
      <!--<RadarChart v-else class="h-60 sm:h-40" :chartData="taskPerformance" />-->
      <DoughnutChart v-else class="h-60 sm:h-40" :chartData="taskWorkspace" />
    </div>
      <div class="px-4 py-2 mx-auto bg-white shadow rounded w-full sm:w-6/12 mb-4 sm:mb-0 sm:h-60">
      <p class="text-xl font-bold text-gray-600 py-4">Tasks Request</p>
      <div v-if="fetchingRequest">
        <p class="py-4 text-base text-center text-gray-500 font-medium"><ArrowPathIcon class="h-6 w-6 inline mr-2 animate-spin"></ArrowPathIcon> Fetching Request Data...</p>
      </div>
      <BarChart v-else class="h-60 sm:h-40" :chartData="taskRequest" />
    </div>
    </div>
    <!-- /Task Statistics -->
    
    <div class="flex justify-between mt-6 mb-6 sm:mt-8">
      <p class="text-xl font-bold text-gray-600">Task</p>
      <div>
        <router-link to="task" class="text-indigo-500 font-medium text-sm uppercase">See all</router-link>
      </div>
    </div>
    
    <div class="sm:flex sm:justify-start px-1 sm:space-x-4 space-y-4 sm:space-y-0">
      
      <!-- task card -->
      <div v-if="fetchingAllTask">
        <p class="py-4 text-base text-center text-gray-500 font-medium"><ArrowPathIcon class="h-6 w-6 inline mr-2 animate-spin"></ArrowPathIcon> Fetching Task...</p>
      </div>
      <router-link v-else :to="`/${route.params.company}/task/${task._id}`" v-for="task in tasks" :key="task.id" class="block bg-white shadow px-4 py-4 w-full sm:w-52 rounded-md">
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
      <!-- /task card-->
      
    </div>
    
    <div class="flex justify-between mt-8 mb-6 sm:mt-8">
      <p class="text-xl font-bold text-gray-600">Workspace's</p>
    <div>
      <router-link to="workspace" class="text-indigo-500 font-medium text-sm uppercase">See all</router-link>
    </div>
    </div>
    
    <div class="sm:flex sm:justify-start px-1 sm:space-x-4 space-y-4 sm:space-y-0">

      <!-- worskace card  -->
      <div v-if="fetchingAllWorkspace">
        <p class="py-4 text-base text-center text-gray-500 font-medium"><ArrowPathIcon class="h-6 w-6 inline mr-2 animate-spin"></ArrowPathIcon> Fetching Workspace...</p>
      </div>
      <router-link :to="`/${route.params.company}/workspace/${data._id}`" v-for="data in workspace" :key="workspace.id" class="block bg-white shadow px-4 py-2 w-full sm:w-60 rounded-md">
        <div>
          <p class="text-gray-600 font-medium text-lg">{{ data.title }}</p>
        </div>
        <div class="flex space-x-1 mt-2">
          <p class="inline-block py-1 px-2 bg-gray-100 text-gray-400 w-50 text-xs rounded-md font-medium mb-4">  {{ data.tasks.filter(t => t.assignedUser.id == user.id).length }} Task</p>
          <p class="inline-block py-1 px-2 bg-orange-100 text-orange-400 w-50 text-xs rounded-md font-medium mb-4">  {{ (data.tasks.filter(t => t.assignedUser.id == user.id)).filter(t => t.todos.some(d => d.done !== true)).length }} In progress</p>
          <p class="inline-block py-1 px-2 bg-green-100 text-green-400 w-50 text-xs rounded-md font-medium mb-4">  {{ (data.tasks.filter(t => t.assignedUser.id == user.id)).filter(t => t.todos.every(d => d.done == true )).length }} Completed</p>
        </div>
      </router-link>
      <!-- /workspace card -->
    </div>
  </div>
</template>

<script setup>
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

import { LineChart, PolarAreaChart, BarChart, RadarChart, DoughnutChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
Chart.register(...registerables)

import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toast-notification'

const $toast = useToast()
const router = useRouter()
const route = useRoute()
const user = useUserStore()

let fetchStats = ref(false)

onBeforeMount(async() => {
  console.log(user)
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

        fetchStats.value = true

        if(res.data.user.company != route.params.company) {
          router.back()
        }
        console.log(res)
        if(auth) {
          user.setUser({ userData, auth, token })
          console.log('auth')
        }
      })
      .catch(err => {
        user.$reset()
        console.log(err)
        router.push(`/login`)
        $toast.error('User not authenticated!', {position: 'top-right'})
        console.log('not auth')

      })
  }
})

const taskCompletedData = ref()
const fetchingTask = ref(true)
const taskCompleted = ref({
  labels: [],
  datasets: [
    {
      label: 'Completed',
      data: [1,2,3],
      fill: true,
      borderColor: '#34d399',
      backgroundColor: '#6ee7b7',
      tension: 0.4,
    }
  ]
})

const taskAboutData = ref()
const fetchingAbout = ref(true)
const taskAbout = ref({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: ['#6b7280', '#d97706', '#10b981']
    }
  ]
})

const taskWorkspaceData = ref()
const fetchingtaskWorkspace = ref(true)
const taskWorkspace = ref({
  labels: ['Paris', 'Nîmes','third'],
  datasets: [
    {
      data: [30, 40],
      backgroundColor: ['#ef4444', '#f97316', '#10b981', '#0ea5e9', '#14b8a6', '#8b5cf6', '#ec4899', '#a855f7'],
    },
  ],
})

const taskRequestData = ref()
const fetchingRequest = ref(true)
const taskRequest = ref({
   labels: [],
   datasets: [
     {
       label: 'Number of request per day',
       data: [],
       backgroundColor: '#374151',
       borderColor: '#4b5563'
     }
   ]
 })
 
const fetchingAllTask = ref(true)
const allTask = ref()
const taskData = ref()

const fetchingAllWorkspace = ref(true)
const allWorkspace = ref()
const workspaceData = ref()

const tasks = ref()
const workspace = ref()

let taskStats = {
  allTask: '',
  inProgress: '',
  completed: ''
}

  onMounted(async() => {

    if(fetchStats) {
      await axios.post('api/task/user/get-task', {
      userId: user.id
    })
    .then(res => {
      tasks.value = res.data.slice(0,4)
      taskStats.allTask = res.data.length
      taskStats.inProgress = res.data.filter(t => t.todos.some(d => d.done !== true)).length
      taskStats.completed = res.data.filter(t => t.todos.every(d => d.done == true )).length
      console.log(taskStats)
    })
    .catch(err => {
      $toast.error('User not authenticated', {position: 'top-right'})
      console.log(err)
    })
    await axios.get('api/workspace/get-workspace')
    .then(res => {
      let ws =  res.data.filter(ws => ws.company == route.params.company)
      workspace.value = ws.slice(0,4)
      
      taskWorkspace.value.labels = ws.map(data => data.title)
      
      let taskLen = []
      
      let temp = ws.forEach(data => {
        let task = data.tasks.filter(t => t.assignedUser.id == user.id)
        taskLen.push(task.length)
      })
      
      taskWorkspace.value.datasets[0].data = taskLen
      console.log(taskLen)
      //console.log(ws)
    })
    .catch(err => {
      $toast.error('User not authenticated!', {position: 'top-right'})
      console.log(err)
    })
    
    await axios.post('api/user/get-user-statistics', {
      id: user.id
    })
    .then(res => {
      taskRequest.value.labels = res.data.task.request.map(data => data.date)
      taskRequest.value.datasets[0].data = res.data.task.request.map(data => data.request)
      fetchingRequest.value = false
      
      taskCompleted.value.labels =  res.data.task.datesCompleted.map(data => data.date)
      taskCompleted.value.datasets[0].data =  res.data.task.datesCompleted.map(data => data.completed)
      //console.log(res.data.task)
    })
    .catch(err => {
      $toast.error('User not authenticated!', {position: 'top-right'})
      console.log(err)
    })
    }
    
    fetchingAllTask.value = false
    fetchingAllWorkspace.value = false
    
    taskAboutData.value = [
      { title: "All Task", data: taskStats.allTask },
      { title: "In progress", data: taskStats.inProgress },
      { title: "completed", data: taskStats.completed },
   ]
   
    taskAbout.value.labels = taskAboutData.value.map(data => data.title)
    taskAbout.value.datasets[0].data = taskAboutData.value.map(data => data.data)
    
    //taskPerformance.value.labels = taskPerformanceData.value.map(data => data.title)
    //taskPerformance.value.datasets[0].data = taskPerformanceData.value.map(data => data.data)
    
    fetchingtaskWorkspace.value = false
    fetchingTask.value = false
    fetchingAbout.value = false
    fetchingAllWorkspace.value = false
  })

</script>

<route lang="yaml">
meta:
  layout: users
</route>