<template>
  <div class="px-4 mt-6 sm:px-6 lg:px-8">
    <div class="flex justify-between ">
      <div class="sm:flex-auto">
        <h1 class="text-lg font-semibold leading-6 text-gray-900">Workspace</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all {{ route.params.company }} workspace data.</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button type="button" @click="isNewWorkspace = true" class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add Workspace</button>
      </div>
    </div>

    <TransitionRoot as="template" :show="isNewWorkspace">
    <Dialog as="div" class="relative z-10">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg sm:p-6">
              <div>
                <DialogTitle class="text-xl font-bold text-gray-600 mb-2">New Workspace</DialogTitle>
                  <label for="email" class="block text-md font-medium leading-6 text-gray-600">Title</label>
                  <div class="mt-2 space-y-2">
                    <input type="text" v-bind="title" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Title" />
                    <p v-if="errors.title" class="text-sm text-red-500">{{ errors.title }}</p>
                    <p v-if="errorTitle" class="text-sm text-red-500">{{ errorTitle }}</p>
                  </div>
               
                <div class="flex justify-end mt-6">
                  <button class="px-4 py-1.5 bg-red-50 rounded text-red-500 mr-3" @click="cancel(false)">Cancel</button>
                  <button class="px-4 py-1.5 bg-indigo-500 text-white rounded" :disabled="!meta.valid" @click="addWorkspace">
                  <span v-if="isLoading">
                    <ArrowPathIcon class="h-5 w-5 inline mr-2 animate-spin"></ArrowPathIcon>
                    Creating workspace...
                  </span>
                  <span v-else>
                    Add workspace
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
        <p class="py-4 text-base text-center text-gray-500 font-medium"><ArrowPathIcon class="h-6 w-6 inline mr-2 animate-spin"></ArrowPathIcon> Fetching Workspace data...</p>
      </div>
      <div v-else class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Workspace Title</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Task</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="workspace in allWorkspaces" :key="workspace._id">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{{ workspace.title }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ workspace.tasks.length }}</td>
                <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                  <router-link :to="`workspace/${workspace._id}`" class="text-indigo-600 hover:text-indigo-900"
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
        let token  = res.data.token
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
let allWorkspaces = ref()
const errorTitle = ref()
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = await true
  workspaceUsers.value = await axios.get('api/workspace/get-users')
  let workspace;
  workspace =  await axios.get('api/workspace/get-workspace')
  allWorkspaces.value = workspace.data.filter(ws => ws.company == route.params.company)
  isLoading.value = await false
})

const { values, errors, defineInputBinds, meta, handleSubmit } = useForm({
  validationSchema: yup.object({
    title: yup.string().required()
  })
})

const title = defineInputBinds('title', {
  validateOnInput: true
})

const isNewWorkspace = ref(false)
const isNewWorkspaceOpen  = (value) => {
  isNewWorkspace.value = value
}

const addWorkspace = async () => {
  errorTitle.value = ''
  isLoading.value = true
    await axios.post('api/workspace/create-workspace', {
      title: values.title,
      company: route.params.company,
      tasks: []
    })
    .then(async (res) => {
      $toast.success('Successfully created a new workspace!', {position: 'top-right'})
      let workspace;
      workspace =  await axios.get('api/workspace/get-workspace')
      allWorkspaces.value = workspace.data.filter(ws => ws.company == route.params.company)
      isLoading.value = false
      isNewWorkspace.value = false
      
    })
    .catch(err => {
      $toast.error('An error occured', {position: 'top-right'})
      errorTitle.value = err.response.data.title
      isLoading.value = false
      console.log(err)
    })
}

const cancel = (value) => {
  isNewWorkspace.value = value
}
</script>

<route lang="yaml">
meta:
  layout: users
</route>